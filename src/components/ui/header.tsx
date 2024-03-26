import { auth, signIn, signOut } from "@/auth";
import { Button } from "./button";
import Image from "next/image";
import Link from "next/link";

type Props = {};

function SignOut() {
  const signOutAction = async () => {
    "use server";
    await signOut();
  };
  return (
    <form action={signOutAction}>
      <Button type="submit">Sign out</Button>
    </form>
  );
}
const Header = async (props: Props) => {
  const session = await auth();
  return (
    <header className="border bottom-1">
      <nav className="bg-white border-gray-200 px-4 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <h1>AI Form Builder</h1>
          {session?.user ? (
            <div className="flex gap-6 items-center">
              {session.user.name && session.user.image && (
                <Image
                  src={session.user.image}
                  alt={`${session.user.name} Profile Picture`}
                  width={40}
                  height={40}
                  className="rounded-full border border-gray-600"
                />
              )}
              <div>{session.user.name}</div>
              <SignOut />
            </div>
          ) : (
            <Link href="api/auth/signin">
              <Button variant="link">Sign In</Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};
export default Header;
