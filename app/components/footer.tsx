import Link from 'next/link';
import { FaGithub } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full border-t border-blue-700 mt-16 py-8 px-6 flex flex-col items-center justify-center text-sm text-white bg-blue-900 space-y-4">

      {/* 著作権表示 */}
      <p className="text-center text-base font-medium">
        &copy; {new Date().getFullYear()} 大阪大学将棋部．All rights reserved．
      </p>

      {/* ソーシャルリンク */}
      <div className="flex space-x-4">
        <Link
          href="https://github.com/DaikiKazusaki/database"
          className="text-white hover:text-blue-300 transition-colors duration-200"
          aria-label="GitHub Repository"
        >
          <FaGithub size={24} />
        </Link>
      </div>

      {/* 開発者クレジット */}
      <p className="text-white text-center opacity-80">
        This website is developed by Daiki Kazusaki.
      </p>
    </footer>
  );
}
