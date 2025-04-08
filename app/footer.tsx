import { FaGithub } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="py-6 border-t">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500 space-y-2">
        <p>&copy; {new Date().getFullYear()} 大阪大学将棋部 All rights reserved.</p>
        <div className="flex justify-center">
          <a
            href="https://github.com/DaikiKazusaki/database"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FaGithub className="w-6 h-6" />
          </a>
        </div>
        <p>This website is created by Daiki Kazusaki.</p>
      </div>
    </footer>
  );
}
