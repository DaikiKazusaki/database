import { FaGithub } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t mt-10">
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-center items-center">
          <p className="text-center">
            &copy; {currentYear} 大阪大学将棋棋譜データベース. All rights reserved.
          </p>
        </div>
        <div className="flex justify-center items-center mt-2">
          <a
            href="https://github.com/DaikiKazusaki/database"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-black transition-colors"
          >
            <FaGithub size={24} />
          </a>
        </div>
        <div className="text-sm text-muted-foreground flex justify-center items-center mt-2">
          This site is created by Daiki Kazusaki.
        </div>
      </div>
    </footer>
  );
}
