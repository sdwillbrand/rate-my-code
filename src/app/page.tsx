/* eslint-disable @typescript-eslint/no-empty-function */
"use client";
import Post from "@/components/Post.client";
import { api } from "@/trpc/react";

function Home() {
  const latestSnippets = api.snippet.getLatests.useQuery();
  return (
    <main className="flex min-h-screen flex-col items-center gap-5">
      {latestSnippets.data?.map((snippet) => (
        <Post key={snippet.id} snippet={snippet} />
      ))}
    </main>
  );
}

export default Home;
