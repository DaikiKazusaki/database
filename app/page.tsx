import { redirect } from "next/navigation";

// サイト全体は proxy.ts のBasic認証で保護しているため、ルートはホームへ送る
export default function RootPage() {
  redirect("/home");
}
