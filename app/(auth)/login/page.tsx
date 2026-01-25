"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <form
        className="flex flex-col gap-4"
        onSubmit={() =>
          signIn("credentials", {
            identifier: email,
            password,
            redirect: true,
            callbackUrl: "/dashboard",
          })}>
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
}