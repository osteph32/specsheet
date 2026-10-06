import { useAuth } from "../features/auth/useAuth";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div>
        <p className="text-sm font-medium text-zinc-500">Dashboard</p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Welcome back, {user?.username}
        </h1>

        <p className="mt-2 text-zinc-400">
          Here's an overview of your vehicles and ownership activity.
        </p>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStat label="Vehicles" value="0" />
        <DashboardStat label="Maintenance due" value="0" />
        <DashboardStat label="Active builds" value="0" />
        <DashboardStat label="Total invested" value="$0" />
      </section>

      <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-medium">Your garage is empty</h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
          Vehicle management will be added in the next development phase. Your
          vehicles, maintenance activity, builds, and ownership costs will
          appear here.
        </p>
      </section>
    </div>
  );
}

interface DashboardStatProps {
  label: string;
  value: string;
}

function DashboardStat({ label, value }: DashboardStatProps) {
  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
      <p className="text-sm text-zinc-500">{label}</p>

      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </article>
  );
}
