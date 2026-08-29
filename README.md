# 棋譜データベース

大阪大学将棋部の棋譜データベース．部員が入れ替わっても運用が止まらないよう，
必要な設定はすべてこのリポジトリに置いてある．初めて触る人は次の「ローカル開発の始め方」から読むこと．

## ドキュメント

| 文書 | 中身 | よく開くところ |
| --- | --- | --- |
| [docs/handover.md](docs/handover.md) | 引き継ぎ．誰がアカウントを持っているか，シークレットはどこにあるか，代替わりで何をするか | [アカウント台帳](docs/handover.md#アカウント台帳)／[部のアカウントへの移管](docs/handover.md#部のアカウントへの移管)／[Basic認証のパスワードを変えるとき](docs/handover.md#basic認証のパスワードを変えるとき)／[毎年やること](docs/handover.md#毎年やること) |
| [docs/runbook.md](docs/runbook.md) | 障害対応．症状から原因を切り分ける手順 | [症状別](docs/runbook.md#症状別)／[削除した棋譜を戻す](docs/runbook.md#削除した棋譜を戻す)／[バックアップから復元する](docs/runbook.md#バックアップから復元する)／[棋譜がまとめて消えたとき](docs/runbook.md#棋譜がまとめて消えたとき) |
| このREADME | 開発の始め方，画面とAPIの一覧，DBとバックアップの扱い | [ローカル開発の始め方](#ローカル開発の始め方)／[変更の進め方](#変更の進め方)／[バックアップと復元](#バックアップと復元) |

担当を引き継ぐときは `docs/handover.md` を上から埋め直す．サイトが落ちたときは `docs/runbook.md` から読む．

## ローカル開発の始め方

```bash
git clone https://github.com/DaikiKazusaki/database.git
cd database

# .nvmrc のバージョンに合わせる（nvm を使っていない場合は Node 22 以上を用意する）
nvm use

npm ci

# 環境変数を用意する。値は部のパスワードマネージャか Vercel から取る
cp .env.example .env.local
#   Vercel CLI が入っているなら: vercel env pull .env.local

npm run dev
```

開発用に別のDBを立てる場合は，Neonで空のデータベースを作って `db/schema.sql` を流し込む．
`.env.local` に入れる値の出どころは [docs/handover.md](docs/handover.md#シークレットの置き場所) にまとめてある．

## 変更の進め方

```bash
npm run typecheck   # tsc --noEmit
npm run lint
npm test            # vitest（app/lib のロジック）
npm run test:watch  # 書きながら回す
```

この3つは `.github/workflows/ci.yml` がPRごとに走らせる．mainへ直接pushせず，PRを経由すること．
ただし1人しか動いていない期間は，CIが通っていればセルフマージしてよい．

棋譜の解析・検証のロジックは `app/lib/` に置き，Next.jsのAPIをimportしないこと．
フレームワークが変わっても，この部分だけは持ち出せるようにしておくため．

`app/lib/parseKifu.ts` を触るときは `app/lib/__tests__/fixtures/` に棋譜のサンプルがある．
新しい棋譜ソフトに対応したら，その出力を1つ足すこと．これが対応形式の仕様書がわりになる．
フィクスチャは架空の対局にすること（実名を含む棋譜をリポジトリに置かない）．

## ファイル構成
```
----
database/
├── .github/
|   ├── workflows  // CI・棋譜の日次バックアップ
|   └── dependabot.yml
├── app/
|   ├── api        
|   ├── components // 全てのページで用いるファイル
|   ├── home       // ホーム画面
|   ├── input      // 棋譜入力画面
|   ├── lib        // 棋譜の解析・DB接続・入力検証
|   |   └── __tests__ // ロジックのテストと棋譜のサンプル
|   ├── search     // 棋譜検索画面
│   └── page.tsx
├── db/
|   └── schema.sql // DBのスキーマ（自動生成・手で編集しない）
├── docs/
|   ├── handover.md // 引き継ぎ・アカウント台帳
|   └── runbook.md  // 障害対応
├── public/
├── scripts/       // バックアップ・復元・スキーマ書き出し
├── .env.example   // 必要な環境変数の雛形
├── .gitignore
├── .nvmrc         // Nodeのバージョン
├── README.md
├── eslint.config.mjs
├── proxy.ts       // Basic認証（Next.js 16のProxy）
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## ページ構成
| ページ名 | 内容 |
| ---- | ---- |
| `/` | `/home` へリダイレクト（サイト全体はBasic認証で保護） |
| `/home` | ホーム画面 |
| `/input` | 棋譜入力ページ（KIF形式の棋譜から対局情報を自動入力） |
| `/search` | 棋譜検索ページ |
| `/search/[id]` | 棋譜再生ページ（個別の対局） |
| `/search/[id]/edit` | 棋譜の編集ページ |

## 認証
サイト全体を `proxy.ts`（Next.js 16でmiddlewareから改称）によるBasic認証で保護しています．静的アセット（`/_next/static` など）以外の全てのページ・APIにアクセスする際，ブラウザの認証ダイアログでユーザー名とパスワードの入力が必要です．

## API
| エンドポイント | 内容 |
| ---- | ---- |
| `GET /api/games` | 棋譜一覧（`q`・`from`・`to`で絞り込み，`limit`・`offset`でページング）．棋譜本文は含まない |
| `GET /api/games/[id]` | 棋譜1件（本文つき） |
| `GET /api/suggestions` | 入力候補（氏名・大学名・大会名） |
| `POST /api/submit-kifu` | 棋譜の登録（未入力項目は棋譜から補完，重複は登録しない） |
| `POST /api/update-game` | 棋譜の更新 |
| `POST /api/delete-game` | 棋譜の削除（`deleted_at`を立てる論理削除） |

## データベース
スキーマの正本は `db/schema.sql`．新しいDBはこれを流し込めば作れる．

| 項目 | 内容 |
| ---- | ---- |
| `deleted_at` | 削除日時．NULLのものだけを表示する（誤削除しても復元できる） |
| `games_date_idx` | `(date DESC, id DESC)` の一覧・並び替え用インデックス |
| `games_kifu_md5_idx` | `md5(kifu)` の重複登録チェック用インデックス |

削除した棋譜を復元する場合は `UPDATE games SET deleted_at = NULL WHERE id = ...;` を実行する．

`date` 列は `date` 型（時刻を持たない）．DBから取り出すと実行環境のタイムゾーンで解釈された `Date` になるため，
表示や比較に使うときは日付として扱うこと．バックアップでは `to_char` で文字列に固定している．

### スキーマを変更したとき
1. 変更用のSQLを `db/migrations/0001_なにをするか.sql` として追加する（連番）
2. 本番へ適用する
3. `npm run dump-schema` で `db/schema.sql` を再生成し，両方をコミットする

`db/schema.sql` は自動生成なので手で編集しない．

## バックアップと復元
`.github/workflows/backup.yml` が毎日03:00（JST）に `games` を全件JSONへ書き出し，Actionsのアーティファクトとして保存する．
アーティファクトは90日で消えるので，長期保存する場合は**プライベート**リポジトリへの保存を有効にすること
（棋譜には実名が含まれるため，公開リポジトリに置いてはいけない）．手順はワークフローのコメントに書いてある．

動かすには，GitHubの Settings > Secrets and variables > Actions に `DATABASE_URL` を登録しておく必要がある．

```bash
npm run backup                                        # backup/games-YYYY-MM-DD.json を作る
npm run restore -- backup/games-2026-08-29.json       # 何件戻るかを表示するだけ（書き込まない）
npm run restore -- backup/games-2026-08-29.json --yes # 実際に書き戻す
```

復元は既存の `id` を上書きせず，DBに無い行だけを入れる．
**年に一度，実際に復元を試すこと．** 試していないバックアップはバックアップではない．

### 大学名の表記ゆれ
大学名は末尾の「大学」を付けない短縮形（`大阪`・`関西学院` など）で保存する．
`app/lib/normalizeUniversity.ts` が登録・更新時に正規化するため，`大阪大学` や `阪大` と入力しても `大阪` として保存される．
略称の対応表は同ファイルの `ALIASES` に追記できる．検索語にも同じ正規化をかけているため，どの表記で検索しても同じ結果になる．

## 環境変数
雛形は `.env.example`．コピーして `.env.local` を作る．値そのものはリポジトリに置かない．

| 変数名 | 内容 |
| ---- | ---- |
| `BASIC_AUTH_USER` | Basic認証のユーザー名 |
| `BASIC_AUTH_PASSWORD` | Basic認証のパスワード |
| `DATABASE_URL` | Neonの接続文字列 |

本番の値は Vercel の環境変数，CI用の `DATABASE_URL` は GitHub の Actions secrets に登録する．

## Nodeのバージョン
`.nvmrc` が正本（現在は 24）．`npm ci` と CI もこれに従う．
**Vercelの Settings > General > Node.js Version も同じメジャーバージョンに合わせること．**
ここだけはリポジトリから制御していないので，`.nvmrc` を上げたら手で直す必要がある．

## 参考にしたサイト
- [Vercel ホームページ](https://vercel.com/)
- [Neon Databese公式ドキュメント](https://neon.tech/docs/introduction)
- [棋譜再生ページ](https://shogi-player.netlify.app/guide/)
- [basic認証](https://qiita.com/axoloto210/items/747eb784e61b173d30b8)
