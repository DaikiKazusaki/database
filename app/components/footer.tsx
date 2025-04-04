export default function Footer() {
    const currentYear = new Date().getFullYear()
  
    return (
      <footer className="border-t mt-10">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">© {currentYear} 将棋棋譜データベース. All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                利用規約
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                プライバシーポリシー
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                お問い合わせ
              </a>
            </div>
          </div>
        </div>
      </footer>
    )
  }
  
  