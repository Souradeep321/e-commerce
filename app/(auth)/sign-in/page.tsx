import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <div>
      <h1 className="mb-6 text-center text-xl font-medium text-neutral-900">Sign In</h1>
      <SignInForm />
    </div>
  );
}