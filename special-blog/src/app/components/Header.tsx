import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          Special Blog
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link href="/write" className="text-gray-600 hover:text-gray-900">
            Write
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-gray-900">
            Sign In
          </Link>
          <Link 
            href="/signup" 
            className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}