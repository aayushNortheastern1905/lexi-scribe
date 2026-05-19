export default function Footer() {
  return (
    <footer className="bg-gray-900 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-[#1D9E75] flex items-center justify-center">
            <span className="text-white text-xs font-bold">L</span>
          </div>
          <span className="text-white font-semibold">Lexi Scribe</span>
          <span className="text-gray-500 text-sm">— Built on Lexi</span>
        </div>
        <div className="text-gray-500 text-sm text-center">
          A proof of concept by Aayush Sawant · Built for Lexi
        </div>
        <div className="text-gray-600 text-xs">© 2026 Lexi Scribe</div>
      </div>
    </footer>
  );
}
