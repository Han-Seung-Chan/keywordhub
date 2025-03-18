export default function Footer() {
  return (
    <footer className="mt-8 border-t border-gray-200 py-8 text-center text-gray-500">
      <div className="fixed-layout">
        <p>© {new Date().getFullYear()} 키워드허브. All rights reserved.</p>
        <nav aria-label="푸터 내비게이션" className="mt-4">
          <ul className="flex justify-center space-x-6">
            <li>
              <a href="/terms" className="hover:text-primary">
                이용약관
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-primary">
                개인정보처리방침
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-primary">
                문의하기
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
