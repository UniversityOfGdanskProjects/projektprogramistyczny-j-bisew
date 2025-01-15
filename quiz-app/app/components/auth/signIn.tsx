'use client';

interface SignInProps {
  onSignIn: (email: string, password: string) => void;
  onSwitchToSignUp: () => void;
}

export default function SignIn({ onSignIn, onSwitchToSignUp }: SignInProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    onSignIn(email, password);
  };

  return (
    <div className="p-6">
      <div>
        <h2 className="text-center text-2xl font-bold text-slate-100">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-300">
          Or{' '}
          <button
            onClick={onSwitchToSignUp}
            className="font-medium text-blue-500 hover:text-blue-400"
          >
            create a new account
          </button>
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-200">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
              Remember me
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}