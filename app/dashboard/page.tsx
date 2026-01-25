// app/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  console.log("Session data:", session);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Not authenticated</p>;

  return (
    <div>
      <h1>Welcome {session.user.name}</h1>
      <p>Role: {session.user.role}</p>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
