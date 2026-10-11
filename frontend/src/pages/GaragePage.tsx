import { PageHeader } from "../components/layout/PageHeader";
import { VehicleCard } from "../features/vehicles/VehicleCard";
import { useVehicles } from "../features/vehicles/useVehicles";
import { Link } from "react-router-dom";

export function GaragePage() {
  const { data: vehicles, isLoading, isError } = useVehicles();

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <PageHeader
        eyebrow="Garage"
        title="Your vehicles"
        description="Manage the vehicles in your private garage."
      />

      <div className="mt-6">
        <Link
          to="/garage/new"
          className="inline-flex rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-white"
        >
          Add vehicle
        </Link>
      </div>

      {isLoading && (
        <p className="mt-8 text-sm text-zinc-400">Loading your garage...</p>
      )}

      {isError && (
        <div className="mt-8 rounded-xl border border-red-900 bg-red-950/40 p-4">
          <p className="text-sm text-red-300">Unable to load your vehicles.</p>
        </div>
      )}

      {!isLoading && !isError && vehicles?.length === 0 && (
        <section className="mt-8 rounded-2xl border border-dashed border-zinc-700 p-8">
          <h2 className="text-lg font-medium">Your garage is empty</h2>

          <p className="mt-2 text-sm text-zinc-400">
            Add your first vehicle to start tracking ownership, maintenance,
            builds, and expenses.
          </p>
        </section>
      )}

      {vehicles && vehicles.length > 0 && (
        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </section>
      )}
    </div>
  );
}
