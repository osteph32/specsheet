import { Link, Navigate, useParams } from "react-router-dom";

import { PageHeader } from "../components/layout/PageHeader";
import { useVehicle } from "../features/vehicles/useVehicle";

export function VehicleDetailPage() {
  const { vehicleId } = useParams();

  const parsedVehicleId = Number(vehicleId);
  const isValidVehicleId =
    Number.isInteger(parsedVehicleId) && parsedVehicleId > 0;

  const {
    data: vehicle,
    isLoading,
    isError,
  } = useVehicle(isValidVehicleId ? parsedVehicleId : 0);

  if (!isValidVehicleId) {
    return <Navigate to="/garage" replace />;
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-sm text-zinc-400">Loading vehicle...</p>
      </div>
    );
  }

  if (isError || !vehicle) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <PageHeader
          eyebrow="Garage"
          title="Vehicle unavailable"
          description="This vehicle could not be loaded."
        />

        <Link
          to="/garage"
          className="mt-6 inline-block text-sm text-zinc-300 hover:text-white"
        >
          Back to garage
        </Link>
      </div>
    );
  }

  const displayName =
    vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          eyebrow="Garage"
          title={displayName}
          description={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        />

        <Link
          to={`/garage/${vehicle.id}/edit`}
          className="rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-white"
        >
          Edit vehicle
        </Link>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <VehicleDetail label="Type" value={vehicle.vehicle_type} />

        <VehicleDetail label="Status" value={vehicle.status} />

        <VehicleDetail
          label="Mileage"
          value={`${vehicle.current_mileage.toLocaleString()} miles`}
        />

        <VehicleDetail label="Trim" value={vehicle.trim || "Not specified"} />

        <VehicleDetail label="VIN" value={vehicle.vin || "Not specified"} />

        <VehicleDetail
          label="Purchase date"
          value={
            vehicle.purchase_date
              ? new Date(
                  `${vehicle.purchase_date}T00:00:00`,
                ).toLocaleDateString()
              : "Not specified"
          }
        />

        <VehicleDetail
          label="Purchase price"
          value={
            vehicle.purchase_price
              ? `$${Number(vehicle.purchase_price).toLocaleString()}`
              : "Not specified"
          }
        />

        <VehicleDetail
          label="Purchase mileage"
          value={
            vehicle.purchase_mileage !== null
              ? `${vehicle.purchase_mileage.toLocaleString()} miles`
              : "Not specified"
          }
        />

        <VehicleDetail
          label="Added"
          value={new Date(vehicle.created_at).toLocaleDateString()}
        />

        <VehicleDetail
          label="Last updated"
          value={new Date(vehicle.updated_at).toLocaleDateString()}
        />
      </section>

      <Link
        to="/garage"
        className="mt-8 inline-block text-sm text-zinc-400 transition hover:text-zinc-100"
      >
        ← Back to garage
      </Link>
    </div>
  );
}

interface VehicleDetailProps {
  label: string;
  value: string;
}

function VehicleDetail({ label, value }: VehicleDetailProps) {
  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>

      <p className="mt-2 font-medium capitalize">{value}</p>
    </article>
  );
}
