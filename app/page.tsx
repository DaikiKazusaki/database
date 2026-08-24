import { redirect } from "next/navigation";

// サイト全体はmiddlewareのBasic認証で保護しているため、ルートはホームへ送る
export default function RootPage() {
  redirect("/home");
}
