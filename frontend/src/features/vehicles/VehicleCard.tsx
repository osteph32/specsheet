import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../auth/useAuth";
import { deleteVehicle } from "./api";
import type { Vehicle } from "./types";
import { vehicleQueryKey } from "./useVehicles";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!accessToken) {
        throw new Error("An access token is required.");
      }

      return deleteVehicle(accessToken, vehicle.id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: vehicleQueryKey,
      });
    },
  });

  const displayName =
    vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  async function handleDelete(): Promise<void> {
    const confirmed = window.confirm(`Delete ${displayName} from your garage?`);

    if (!confirmed) {
      return;
    }

    await deleteMutation.mutateAsync();
  }

  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {vehicle.vehicle_type}
          </p>

          <h2 className="mt-2 text-xl font-semibold">{displayName}</h2>

          {vehicle.nickname && (
            <p className="mt-1 text-sm text-zinc-400">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
          )}

          {vehicle.trim && (
            <p className="mt-1 text-sm text-zinc-500">{vehicle.trim}</p>
          )}
        </div>

        <button
          type="button"
          disabled={deleteMutation.isPending}
          onClick={handleDelete}
          className="text-sm text-zinc-500 transition hover:text-red-400 disabled:opacity-50"
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </button>
      </div>

      <div className="mt-6 border-t border-zinc-800 pt-4">
        <p className="text-xs text-zinc-500">Current mileage</p>

        <p className="mt-1 font-medium">
          {vehicle.current_mileage.toLocaleString()} miles
        </p>
      </div>
    </article>
  );
}
