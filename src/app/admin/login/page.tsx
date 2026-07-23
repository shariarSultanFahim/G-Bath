"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid credentials or non-admin account");
      } else {
        toast.success("Welcome, Admin");
        router.push("/admin");
        router.refresh();
      }
    } catch {
      toast.error("An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#E8621A]">Good</h1>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
            Admin Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gbath.com"
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#E8621A] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-[#E8621A] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#E8621A] py-3 text-sm font-semibold text-white shadow-md hover:bg-orange-600 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
