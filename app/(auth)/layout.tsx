import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-white px-4 py-12">
      <div className="mx-auto w-full max-w-83 pt-1">
        <Link
          href="/"
          className="mb-12 block text-center"
        >
          <Wordmark />
        </Link>

        {children}
      </div>
    </main>
  );
}