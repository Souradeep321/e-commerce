"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();


  return (
    <div>
      <form
        className="flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await signIn("credentials", {
            identifier: email,
            password,
            redirect: false,
          });

          if (res?.ok) {
            router.push("/dashboard");
          } else {
            console.log(res?.error); // CredentialsSignin
          }
        }}
      >
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-primary"
        >
          Login
        </button>
      </form>
    </div>
  );
}