/* eslint-disable @typescript-eslint/no-empty-function */
"use client";
import ViewEditor from "@/components/ViewEditor";
import { api } from "@/trpc/react";

function Home() {
  const latestSnippets = api.snippet.getLatests.useQuery();
  return (
    <main className="flex min-h-screen flex-col items-center gap-5">
      {latestSnippets.data?.map((snippet) => (
        <ViewEditor key={snippet.id} snippet={snippet} />
      ))}
    </main>
  );
}

export default Home;
