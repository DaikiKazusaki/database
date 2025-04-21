import Link from 'next/link';
import { FaGithub } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-700 mt-16 py-8 px-6 flex flex-col items-center justify-center text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 space-y-3">
      <p className="text-center text-base font-medium">
        &copy; {new Date().getFullYear()} 大阪大学将棋部．All rights reserved.
      </p>

      <div className="flex space-x-4">
        <Link
          href="https://github.com/DaikiKazusaki/database"
          className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200"
          aria-label="GitHub Repository"
        > 
          <FaGithub size={24} />
        </Link>
      </div>

      <p className="text-gray-500 dark:text-gray-500">
        This website is developed by Daiki Kazusaki.
      </p>
    </footer>
  );
}
