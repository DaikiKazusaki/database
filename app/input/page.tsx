import { Metadata } from "next";
import InputForm from "./InputForm"; // クライアント側フォーム

export const metadata: Metadata = {
  title: "棋譜入力",
  description: "大阪大学将棋部によるWeb棋譜データベース",
};

export default function Page() {
  return <InputForm />;
}
