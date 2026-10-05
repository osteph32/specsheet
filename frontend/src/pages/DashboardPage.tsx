import { useNavigate } from "react-router-dom";

import { useAuth } from "../features/auth/useAuth";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout(): Promise<void> {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-zinc-100">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between border-b border-zinc-800 pb-6">
          <div>
            <p className="text-sm text-zinc-500">SpecSheet</p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Dashboard
            </h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium transition hover:bg-zinc-900"
          >
            Log out
          </button>
        </header>

        <section className="mt-10">
          <p className="text-sm text-zinc-500">Signed in as</p>

          <p className="mt-2 text-xl font-medium">{user?.username}</p>

          <p className="mt-1 text-zinc-400">{user?.email}</p>
        </section>

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-medium">Your garage is ready.</h2>

          <p className="mt-2 text-zinc-400">
            Vehicle management will be added in the next development phase.
          </p>
        </section>
      </div>
    </main>
  );
}
