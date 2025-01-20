import QuizResultsPage from "@/app/components/quiz/result";

interface Params {
  id: string;
}

export default async function PokemonDetailsPage({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <>
      <QuizResultsPage params={{ id }} />
    </>
  );
}
