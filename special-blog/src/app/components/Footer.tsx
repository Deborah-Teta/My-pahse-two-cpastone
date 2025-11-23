export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-violet-900 via-purple-500 to-fuchsia-800 border-t border-gray-200 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <p className="text-white text-sm">
            © 2025 special blog. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white hover:text-green-900 text-sm">
              About
            </a>
            <a href="#" className="text-white hover:text-green-900 text-sm">
              Terms
            </a>
            <a href="#" className="text-white hover:text-green-900 text-sm">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}