import Header from "./components/header";
import Footer from "./components/footer";
import ClientProvider from "./components/ClientProvider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProvider>
          <Header />
          <main className="p-4">{children}</main>
          <Footer />
        </ClientProvider>
      </body>
    </html>
  );
}
