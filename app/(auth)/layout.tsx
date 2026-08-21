import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* TODO: replace with actual site name/logo */}
        <Link
          href="/"
          className="mb-8 block text-center font-serif text-2xl text-neutral-900"
        >
          Your Brand
        </Link>
        {children}
      </div>
    </main>
  );
}