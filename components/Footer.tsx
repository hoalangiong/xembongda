export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900 py-6">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} XemBongDa — Lịch thi đấu & kết quả bóng đá trực tuyến</p>
        <p className="mt-1">Dữ liệu từ API-Football. Không lưu trữ video bản quyền.</p>
      </div>
    </footer>
  );
}
