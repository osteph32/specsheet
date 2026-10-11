import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "../components/layout/PageHeader";
import { useAuth } from "../features/auth/useAuth";
import { createVehicle } from "../features/vehicles/api";
import type { VehicleFormValues } from "../features/vehicles/schemas";
import { VehicleForm } from "../features/vehicles/VehicleForm";
import { vehicleQueryKey } from "../features/vehicles/useVehicles";

export function AddVehiclePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (values: VehicleFormValues) => {
      if (!accessToken) {
        throw new Error("An access token is required.");
      }

      return createVehicle(accessToken, {
        ...values,
        purchase_price:
          values.purchase_price === "" ? null : values.purchase_price,
        purchase_mileage:
          values.purchase_mileage === "" ? null : values.purchase_mileage,
        purchase_date: values.purchase_date || null,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: vehicleQueryKey,
      });

      navigate("/garage");
    },
  });

  async function handleSubmit(values: VehicleFormValues): Promise<void> {
    setSubmitError(null);

    try {
      await mutation.mutateAsync(values);
    } catch {
      setSubmitError(
        "Unable to add vehicle. Check the information and try again.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <PageHeader
        eyebrow="Garage"
        title="Add vehicle"
        description="Add a car, motorcycle, or truck to your private garage."
      />

      <VehicleForm
        submitLabel="Add vehicle"
        submittingLabel="Adding..."
        isSubmitting={mutation.isPending}
        submitError={submitError}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/garage")}
      />
    </div>
  );
}
