import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";

const Header = async () => {
  const session = await getServerAuthSession();

  return (
    <div className="flex w-full items-center justify-end gap-4 p-3">
      <Link href="/">Home</Link>
      <p className="text-center text-xl text-white">
        {session && <span>Logged in as {session.user?.name}</span>}
      </p>
      <Link
        href={session ? "/api/auth/signout" : "/api/auth/signin"}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
      >
        {session ? "Sign out" : "Sign in"}
      </Link>
      {session && <Link href="/user">Create a snippet</Link>}
    </div>
  );
};
export default Header;
