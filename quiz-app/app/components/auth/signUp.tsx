'use client';

interface SignUpProps {
  onSignUp: (formData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => void;
  onSwitchToSignIn: () => void;
}

export default function SignUp({ onSignUp, onSwitchToSignIn }: SignUpProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSignUp({
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    });
  };

  return (
    <div className="p-6">
      <div>
        <h2 className="text-center text-2xl font-bold text-slate-100">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-300">
          Already have an account?{' '}
          <button
            onClick={onSwitchToSignIn}
            className="font-medium text-blue-500 hover:text-blue-400"
          >
            Sign in
          </button>
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-200">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Choose a username"
            />
          </div>
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
              required
              className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Create a password"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}