import Link from 'next/link';
import { Brain, Search, Trophy, Users } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to QuizMaster
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Challenge yourself with interactive quizzes and learn something new every day
            </p>
            <div className="space-x-4">
              <Link 
                href="/quizzes" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Start a Quiz
              </Link>
              <Link
                href="/create"
                className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Create Quiz
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Brain />}
              title="Multiple Quiz Types"
              description="Choose from various quiz types including multiple choice, true/false, and open questions"
            />
            <FeatureCard
              icon={<Search />}
              title="Easy Search"
              description="Find quizzes by category, difficulty level, or keywords"
            />
            <FeatureCard
              icon={<Trophy />}
              title="Earn Achievements"
              description="Complete quizzes to earn badges and climb the leaderboard"
            />
            <FeatureCard
              icon={<Users />}
              title="Community Driven"
              description="Join a community of quiz creators and learners"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="w-12 h-12 text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
}