export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2024 Medium Clone. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
              Terms
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}