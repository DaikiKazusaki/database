import { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "ログイン",
  description: "大阪大学将棋部棋譜データベースログインページ",
};

export default function LoginPage() {
  return <LoginForm />;
}
