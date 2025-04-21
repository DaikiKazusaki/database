import { neon } from '@neondatabase/serverless';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "棋譜検索",
  description: "大阪大学将棋部によるWeb棋譜データベース",
};

export default function Page() {
  async function create(formData: FormData) {
    'use server';
    // Connect to the Neon database
    const sql = neon(`${process.env.DATABASE_URL}`);
    const comment = formData.get('comment');
    // Insert the comment from the form into the Postgres database
    await sql`INSERT INTO comments (comment) VALUES (${comment})`;
  }

  return (
    <form action={create}>
      <input type="text" placeholder="write a comment" name="comment" />
      <button type="submit">Submit</button>
    </form>
  );
}