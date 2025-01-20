import React from 'react';

export default function QuizResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-slate-800 rounded-lg shadow-xl">
        {children}
      </div>
    </div>
  );
}