import Layout from "@/layouts/_layout";
import { SignedIn, UserProfile, useAuth } from "@clerk/nextjs";
import Link from "next/link";

const UserProfilePage = () => {

  const { isSignedIn } = useAuth()

  return <div className="flex justify-center items-center h-full max-h-full">

    {isSignedIn
      ? <UserProfile path="/profile" /> : <h1 className="text-xl">
        Please <Link href="/sign-in" className="text-green-500">Sign In</Link>
      </h1>}
  </div>
}

UserProfilePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default UserProfilePage;