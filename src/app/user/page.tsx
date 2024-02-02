import { getServerAuthSession } from "@/server/auth";
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

  return (
    <div className="w-full max-w-xs">
      <CreateSnippet userId={session.user.id} />
    </div>
  );
}
