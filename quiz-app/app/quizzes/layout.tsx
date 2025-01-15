export default function QuizzesLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-100">Quizzes</h1>
            <p className="text-slate-400 mt-2">
              Browse through our collection of quizzes or search for specific ones
            </p>
          </div>
          {children}
        </div>
      </div>
    )
  }