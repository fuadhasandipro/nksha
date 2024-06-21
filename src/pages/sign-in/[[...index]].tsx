import Seo from '@/layouts/_seo';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <SignIn />
    </div>
  );
}

SignInPage.getLayout = function getLayout(page: any) {
  return <>
    <Seo
      title="Sign In - Noksha"
      description="Noksha Sign In Page"
      url='/sign-in'
    />
    <>{page}</>
  </>
};
