import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import CreateSnippet from "@/components/CreateSnippet.client";

export default async function User() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;
  return (
    <main className="flex min-h-screen flex-col items-center">
      <CrudShowcase />
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestSnippet = await api.snippet.getLatest.query();

  return (
    <div className="w-full max-w-xs">
      {latestSnippet ? (
        <p className="truncate">Your most recent post: {latestSnippet.title}</p>
      ) : (
        <p>You have no snippets yet.</p>
      )}

      <CreateSnippet userId={session.user.id} />
    </div>
  );
}
