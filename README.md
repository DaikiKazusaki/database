# 棋譜データベース

## ファイル構成
```
----
database/
├── app/
|   ├── api        
|   ├── components // 全てのページで用いるファイル
|   ├── home       // ホーム画面
|   ├── input      // 棋譜入力画面
|   ├── lib        // 棋譜の解析・DB接続・入力検証
|   ├── search     // 棋譜検索画面
│   └── page.tsx
├── public/
├── .gitignore
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
サイト全体を `proxy.ts`（Next.js 16でmiddlewareから改称）によるBasic認証で保護しています．静的アセット（`/_next/static` など）以外の全てのページ・APIにアクセスする際、ブラウザの認証ダイアログでユーザー名とパスワードの入力が必要です．

## API
| エンドポイント | 内容 |
| ---- | ---- |
| `GET /api/games` | 棋譜一覧（`q`・`from`・`to`で絞り込み、`limit`・`offset`でページング）．棋譜本文は含まない |
| `GET /api/games/[id]` | 棋譜1件（本文つき） |
| `GET /api/suggestions` | 入力候補（氏名・大学名・大会名） |
| `POST /api/submit-kifu` | 棋譜の登録（未入力項目は棋譜から補完、重複は登録しない） |
| `POST /api/update-game` | 棋譜の更新 |
| `POST /api/delete-game` | 棋譜の削除（`deleted_at`を立てる論理削除） |

## データベース
`games` テーブルの主な仕様．

| 項目 | 内容 |
| ---- | ---- |
| `deleted_at` | 削除日時．NULLのものだけを表示する（誤削除しても復元できる） |
| `games_date_idx` | `(date DESC, id DESC)` の一覧・並び替え用インデックス |
| `games_kifu_md5_idx` | `md5(kifu)` の重複登録チェック用インデックス |

削除した棋譜を復元する場合は `UPDATE games SET deleted_at = NULL WHERE id = ...;` を実行する．

### 大学名の表記ゆれ
大学名は末尾の「大学」を付けない短縮形（`大阪`・`関西学院` など）で保存する．
`app/lib/normalizeUniversity.ts` が登録・更新時に正規化するため、`大阪大学` や `阪大` と入力しても `大阪` として保存される．
略称の対応表は同ファイルの `ALIASES` に追記できる．検索語にも同じ正規化をかけているため、どの表記で検索しても同じ結果になる．

## 環境変数
| 変数名 | 内容 |
| ---- | ---- |
| `BASIC_AUTH_USER` | Basic認証のユーザー名 |
| `BASIC_AUTH_PASSWORD` | Basic認証のパスワード |
| `DATABASE_URL` | Neonの接続文字列 |

## 参考にしたサイト
- [Vercel ホームページ](https://vercel.com/)
- [Neon Databese公式ドキュメント](https://neon.tech/docs/introduction)
- [棋譜再生ページ](https://shogi-player.netlify.app/guide/)
- [basic認証](https://qiita.com/axoloto210/items/747eb784e61b173d30b8)

# Next.js project

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.