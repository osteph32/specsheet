import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { loginSchema, type LoginFormValues } from "../features/auth/schemas";
import { useAuth } from "../features/auth/useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isInitializing } = useAuth();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  if (isInitializing) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
        <p className="text-zinc-400">Restoring session...</p>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(values: LoginFormValues): Promise<void> {
    setSubmitError(null);

    try {
      await login(values);
      navigate("/dashboard", { replace: true });
    } catch {
      setSubmitError("Unable to log in. Check your username and password.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-zinc-100">
      <section className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-zinc-500">SpecSheet</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Sign in to manage your garage.
          </p>
        </div>

        <form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium"
            >
              Username
            </label>

            <input
              id="username"
              autoComplete="username"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 outline-none transition focus:border-zinc-500"
              {...register("username")}
            />

            {errors.username && (
              <p className="mt-2 text-sm text-red-400">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 outline-none transition focus:border-zinc-500"
              {...register("password")}
            />

            {errors.password && (
              <p className="mt-2 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {submitError && (
            <p className="rounded-lg border border-red-900 bg-red-950/50 p-3 text-sm text-red-300">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-zinc-100 px-4 py-2.5 font-medium text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-zinc-100 hover:underline"
          >
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}
