import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-500">
            QuizIt
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/quizzes" className="text-slate-300 hover:text-slate-100 transition-colors">
              Quizzes
            </Link>
            <Link href="/leaderboard" className="text-slate-300 hover:text-slate-100 transition-colors">
              Leaderboard
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/signin"
              className="text-slate-300 hover:text-slate-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}