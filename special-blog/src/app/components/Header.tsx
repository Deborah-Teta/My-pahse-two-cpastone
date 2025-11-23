'use client';

import Link from 'next/link';
import { useAuth } from '../lib/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className=" bg-gradient-to-br from-violet-900 via-purple-500 to-fuchsia-800 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          Special Blog
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {user ? (
            // Logged in
            <>
              <Link href="/write" className="text-gray-800 hover:text-gray-900">
                Write
              </Link>
              <Link href={`/profile/${user.uid}`} className="text-gray-800 hover:text-gray-900">
                Profile
              </Link>
              <button 
                onClick={logout}
                className="text-gray-800 hover:text-gray-900"
              >
                Logout
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <span className="text-sm">{user.displayName}</span>
              </div>
            </>
          ) : (
            // Not logged in
            <>
              <Link href="/write" className="text-blue-800 hover:text-blue-700 underline">
                Write
              </Link>
              <Link href="/login" className="text-blue-800 hover:text-blue-700 underline">
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="bg-blue-700 text-white px-4 py-2 rounded-full hover:bg-blue-900"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}