"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import AuthBottom from "./AuthBottom";
import { useRouter } from "next/navigation";
import GithubLogin from "./GithubLogin";

export default function SigninForm() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: any) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
    });

    router.push("/chat");

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center flex-col gap-4">
      <div className="bg-secondary-foreground p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email or Username"
            value={credentials.email}
            onChange={handleChange}
            className="w-full p-2 border text-black border-gray-300 rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full p-2 text-black border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <div className="my-4 text-center">OR</div>
       <GithubLogin/>
      </div>
      <AuthBottom />
    </div>
  );
}
