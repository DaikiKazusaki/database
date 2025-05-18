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
|   ├── search     // 棋譜検索画面
│   └── page.tsx
├── public/
├── .gitignore
├── README.md
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## ページ構成
| ページ名 | 内容 |
| ---- | ---- |
| `/` | パスワード入力画面 |
| `/home` | ホーム画面 |
| `/input` | 棋譜入力ページ |
| `/search` | 棋譜検索ページ |

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