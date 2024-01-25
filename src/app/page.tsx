import CodeFormatter from "@/components/CodeFormatter.server";
import { api } from "@/trpc/server";

async function Home() {
  const latestSnippets = await api.snippet.getLatests.query();
  return (
    <main className="flex min-h-screen flex-col items-center gap-5">
      {latestSnippets.map((snippet) => (
        <div
          key={snippet.id}
          className="min-w-60 rounded-lg border border-solid"
        >
          <h1 className="text-xl">{snippet.title}</h1>
          <CodeFormatter
            editable={false}
            code={snippet.code}
            language={snippet.language}
          />
        </div>
      ))}
    </main>
  );
}

export default Home;
