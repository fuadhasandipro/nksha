import Seo from '@/layouts/_seo';
import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <SignUp unsafeMetadata={{ isSubscribed: false }} />
    </div>
  );
}


Page.getLayout = function getLayout(page: any) {
  return <>
    <Seo
      title="Sign Up - Noksha"
      description="Noksha Sign Up Page"
      url='/sign-up'
    />
    <>{page}</>
  </>
};
