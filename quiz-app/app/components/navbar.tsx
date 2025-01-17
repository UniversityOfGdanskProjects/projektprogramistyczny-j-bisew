'use client';

import { useState } from 'react';
import Link from 'next/link';
import Modal from './modal';
import SignIn from './auth/signIn';
import SignUp from './auth/signUp';

export default function Navbar() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSignIn = () => {
    setShowSignIn(false);
  };

  const handleSignUp = () => {
    setShowSignUp(false);
  };

  return (
    <>
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-blue-500">
              QuizIt
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/quizzes" className="text-slate-300 hover:text-slate-100 transition-colors">
                Quizzes
              </Link>
              <Link href="/leaderboard" className="text-slate-300 hover:text-slate-100 transition-colors">
                Leaderboard
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSignIn(true)}
                className="text-slate-300 hover:text-slate-100 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowSignUp(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      <Modal isOpen={showSignIn} onClose={() => setShowSignIn(false)}>
        <SignIn
          onClose={()=> setShowSignIn(false)}
          onSwitchToSignUp={() => {
            setShowSignIn(false);
            setShowSignUp(true);
          }}
        />
      </Modal>

      <Modal isOpen={showSignUp} onClose={() => setShowSignUp(false)}>
        <SignUp
          onClose={()=> setShowSignIn(false)}
          onSwitchToSignIn={() => {
            setShowSignUp(false);
            setShowSignIn(true);
          }}
        />
      </Modal>
    </>
  );
}