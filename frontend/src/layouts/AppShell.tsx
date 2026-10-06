import { Outlet, useNavigate } from "react-router-dom";

import { MobileNav } from "../components/navigation/MobileNav";
import { Sidebar } from "../components/navigation/Sidebar";
import { useAuth } from "../features/auth/useAuth";

export function AppShell() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout(): Promise<void> {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6">
            <div>
              <p className="text-sm font-medium md:hidden">SpecSheet</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">{user?.username}</p>

                <p className="text-xs text-zinc-500">{user?.email}</p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-zinc-100"
              >
                Log out
              </button>
            </div>
          </header>

          <MobileNav />

          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
