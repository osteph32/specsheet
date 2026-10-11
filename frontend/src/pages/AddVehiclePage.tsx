import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "../components/layout/PageHeader";
import { useAuth } from "../features/auth/useAuth";
import { createVehicle } from "../features/vehicles/api";
import {
  vehicleSchema,
  type VehicleFormInput,
  type VehicleFormValues,
} from "../features/vehicles/schemas";
import { vehicleQueryKey } from "../features/vehicles/useVehicles";

export function AddVehiclePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormInput, unknown, VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      vehicle_type: "car",
      trim: "",
      nickname: "",
      vin: "",
      current_mileage: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: VehicleFormValues) => {
      if (!accessToken) {
        throw new Error("An access token is required.");
      }

      return createVehicle(accessToken, values);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: vehicleQueryKey,
      });

      navigate("/garage");
    },
  });

  async function onSubmit(values: VehicleFormValues): Promise<void> {
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

      <form
        className="mt-8 space-y-6"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div>
          <label
            htmlFor="vehicle_type"
            className="mb-2 block text-sm font-medium"
          >
            Vehicle type
          </label>

          <select
            id="vehicle_type"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5"
            {...register("vehicle_type")}
          >
            <option value="car">Car</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="truck">Truck</option>
          </select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <VehicleInput
            id="year"
            label="Year"
            type="number"
            error={errors.year?.message}
            registration={register("year")}
          />

          <VehicleInput
            id="make"
            label="Make"
            error={errors.make?.message}
            registration={register("make")}
          />

          <VehicleInput
            id="model"
            label="Model"
            error={errors.model?.message}
            registration={register("model")}
          />

          <VehicleInput
            id="trim"
            label="Trim"
            error={errors.trim?.message}
            registration={register("trim")}
          />

          <VehicleInput
            id="nickname"
            label="Nickname"
            error={errors.nickname?.message}
            registration={register("nickname")}
          />

          <VehicleInput
            id="current_mileage"
            label="Current mileage"
            type="number"
            error={errors.current_mileage?.message}
            registration={register("current_mileage")}
          />
        </div>

        <VehicleInput
          id="vin"
          label="VIN (optional)"
          error={errors.vin?.message}
          registration={register("vin")}
        />

        {submitError && (
          <p className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
            {submitError}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-lg bg-zinc-100 px-4 py-2.5 font-medium text-zinc-950 disabled:opacity-60"
          >
            {mutation.isPending ? "Adding..." : "Add vehicle"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/garage")}
            className="rounded-lg border border-zinc-700 px-4 py-2.5 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

interface VehicleInputProps {
  id: string;
  label: string;
  type?: string;
  error?: string;
  registration: UseFormRegisterReturn;
}

function VehicleInput({
  id,
  label,
  type = "text",
  error,
  registration,
}: VehicleInputProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <input
        id={id}
        type={type}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 outline-none focus:border-zinc-500"
        {...registration}
      />

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
