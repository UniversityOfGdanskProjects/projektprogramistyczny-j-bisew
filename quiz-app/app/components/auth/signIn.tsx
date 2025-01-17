'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import type { SignInData } from '../types/auth';
import { authService } from '@/app/services/auth';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Email is invalid')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const initialValues: SignInData = {
  email: '',
  password: '',
};

interface SignInProps {
  onSwitchToSignUp: () => void;
  onClose: () => void;
}

export default function SignIn({ onSwitchToSignUp, onClose }: SignInProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: SignInData) => {
    try {
      setError(null);
      const res = await authService.login(values.email, values.password);

      if (res.error) {
        setError(res.error);
        return;
      }

      if (res.data) {
        localStorage.setItem('user', JSON.stringify(res.data));
        onClose();
        router.push('/quizzes');
      }
    } catch (error) {
        setError(error instanceof Error ? error.message : 'Something went wrong');
    }
  }

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

      {error && <div className="mt-4 text-red-500">{error}</div>}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                  Email address
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-200">
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}