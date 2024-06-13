import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex h-full items-center justify-center bg-white">
      <SignUp unsafeMetadata={{ isSubscribed: false }} />
    </div>
  );
}
