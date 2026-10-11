import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { PageHeader } from "../components/layout/PageHeader";
import { useAuth } from "../features/auth/useAuth";
import { updateVehicle } from "../features/vehicles/api";
import type { VehicleFormValues } from "../features/vehicles/schemas";
import { VehicleForm } from "../features/vehicles/VehicleForm";
import {
  useVehicle,
  vehicleDetailQueryKey,
} from "../features/vehicles/useVehicle";
import { vehicleQueryKey } from "../features/vehicles/useVehicles";

export function EditVehiclePage() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const parsedVehicleId = Number(vehicleId);
  const isValidVehicleId =
    Number.isInteger(parsedVehicleId) && parsedVehicleId > 0;

  const {
    data: vehicle,
    isLoading,
    isError,
  } = useVehicle(isValidVehicleId ? parsedVehicleId : 0);

  const mutation = useMutation({
    mutationFn: (values: VehicleFormValues) => {
      if (!accessToken) {
        throw new Error("An access token is required.");
      }

      if (!isValidVehicleId) {
        throw new Error("A valid vehicle ID is required.");
      }

      return updateVehicle(accessToken, parsedVehicleId, {
        ...values,
        purchase_price:
          values.purchase_price === "" ? null : values.purchase_price,
        purchase_mileage:
          values.purchase_mileage === "" ? null : values.purchase_mileage,
        purchase_date: values.purchase_date || null,
      });
    },
    onSuccess: async () => {
      if (!isValidVehicleId) {
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: vehicleQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: vehicleDetailQueryKey(parsedVehicleId),
        }),
      ]);

      navigate(`/garage/${parsedVehicleId}`);
    },
  });

  if (!isValidVehicleId) {
    return <Navigate to="/garage" replace />;
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8">
        <p className="text-sm text-zinc-400">Loading vehicle...</p>
      </div>
    );
  }

  if (isError || !vehicle) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8">
        <PageHeader
          eyebrow="Garage"
          title="Vehicle unavailable"
          description="This vehicle could not be loaded."
        />
      </div>
    );
  }

  async function handleSubmit(values: VehicleFormValues): Promise<void> {
    setSubmitError(null);

    try {
      await mutation.mutateAsync(values);
    } catch {
      setSubmitError(
        "Unable to update vehicle. Check the information and try again.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <PageHeader
        eyebrow="Garage"
        title="Edit vehicle"
        description={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      />

      <VehicleForm
        defaultValues={{
          vehicle_type: vehicle.vehicle_type,
          status: vehicle.status,
          year: vehicle.year,
          make: vehicle.make,
          model: vehicle.model,
          trim: vehicle.trim,
          nickname: vehicle.nickname,
          vin: vehicle.vin,
          current_mileage: vehicle.current_mileage,
          purchase_date: vehicle.purchase_date ?? "",
          purchase_price: vehicle.purchase_price
            ? Number(vehicle.purchase_price)
            : "",
          purchase_mileage: vehicle.purchase_mileage ?? "",
        }}
        submitLabel="Save changes"
        submittingLabel="Saving..."
        isSubmitting={mutation.isPending}
        submitError={submitError}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/garage/${vehicle.id}`)}
      />
    </div>
  );
}
