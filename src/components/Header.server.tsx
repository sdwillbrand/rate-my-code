import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";
import PersonIcon from "@mui/icons-material/Person";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import HomeIcon from "@mui/icons-material/Home";

const Header = async () => {
  const session = await getServerAuthSession();

  return (
    <div className="flex w-full items-center justify-between gap-4 p-3">
      <div>
        <Link href="/">
          <HomeIcon />
        </Link>
      </div>
      <div className="flex gap-2">
        {session && <PersonIcon />}
        {session && (
          <Link href="/user">
            <AddCircleIcon />
          </Link>
        )}
        <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
          {session ? <LogoutIcon /> : <LoginIcon />}
        </Link>
      </div>
    </div>
  );
};
export default Header;
