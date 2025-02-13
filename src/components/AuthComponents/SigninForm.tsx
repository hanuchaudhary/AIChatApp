"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

export default function SigninForm() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      callbackUrl: "/", // Redirect after login
    });
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email or Username"
            value={credentials.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
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
        <button
          onClick={() => signIn("github", { callbackUrl: "/" })}
          className="w-full bg-gray-900 text-white py-2 rounded flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
            <path d="M12 .5C5.66.5.5 5.66.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.9-.3.9-.7v-2.7c-3.2.7-3.8-1.5-3.8-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 .1 1.9.8 2.2 1.6.3.7 1.3 1.1 2.4.8.1-1.2.4-2.3.8-2.9-2.5-.3-5.2-1.2-5.2-5.4 0-1.2.4-2.2 1.2-3-.1-.3-.5-1.4.1-3 0 0 1-.3 3.2 1.2.9-.3 1.9-.5 2.9-.5s2 .2 2.9.5c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.7.1 3 .8.8 1.2 1.8 1.2 3 0 4.2-2.7 5.1-5.2 5.4.4.4.8 1.1.8 2.2v3.3c0 .4.3.8.9.7 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.66 18.34.5 12 .5z" />
          </svg>
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
