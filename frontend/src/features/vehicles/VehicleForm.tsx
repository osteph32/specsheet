import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type UseFormRegisterReturn } from "react-hook-form";

import {
  vehicleSchema,
  type VehicleFormInput,
  type VehicleFormValues,
} from "./schemas";

import { VinDecoder } from "./VinDecoder";

interface VehicleFormProps {
  defaultValues?: Partial<VehicleFormInput>;
  submitLabel: string;
  submittingLabel: string;
  isSubmitting: boolean;
  submitError?: string | null;
  onSubmit: (values: VehicleFormValues) => Promise<void>;
  onCancel: () => void;
}

export function VehicleForm({
  defaultValues,
  submitLabel,
  submittingLabel,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
}: VehicleFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<VehicleFormInput, unknown, VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      vehicle_type: "car",
      status: "active",
      trim: "",
      nickname: "",
      vin: "",
      current_mileage: 0,
      purchase_date: "",
      purchase_price: "",
      purchase_mileage: "",
      ...defaultValues,
    },
  });

  const vin =
    useWatch({
      control,
      name: "vin",
    }) ?? "";

  return (
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

      <div>
        <label htmlFor="status" className="mb-2 block text-sm font-medium">
          Status
        </label>

        <select
          id="status"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5"
          {...register("status")}
        >
          <option value="active">Active</option>
          <option value="stored">Stored</option>
          <option value="sold">Sold</option>
          <option value="archived">Archived</option>
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

      <VinDecoder
        vin={vin}
        onApply={(decoded) => {
          if (decoded.year !== null) {
            setValue("year", decoded.year);
          }

          if (decoded.make) {
            setValue("make", decoded.make);
          }

          if (decoded.model) {
            setValue("model", decoded.model);
          }

          if (decoded.trim) {
            setValue("trim", decoded.trim);
          }

          if (decoded.vehicle_type) {
            setValue("vehicle_type", decoded.vehicle_type);
          }
        }}
      />

      <div className="border-t border-zinc-800 pt-6">
        <h2 className="text-lg font-medium">Purchase information</h2>

        <p className="mt-1 text-sm text-zinc-500">
          Optional details used for ownership cost tracking.
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <VehicleInput
            id="purchase_date"
            label="Purchase date"
            type="date"
            error={errors.purchase_date?.message}
            registration={register("purchase_date")}
          />

          <VehicleInput
            id="purchase_price"
            label="Purchase price"
            type="number"
            error={errors.purchase_price?.message}
            registration={register("purchase_price")}
          />

          <VehicleInput
            id="purchase_mileage"
            label="Purchase mileage"
            type="number"
            error={errors.purchase_mileage?.message}
            registration={register("purchase_mileage")}
          />
        </div>
      </div>

      {submitError && (
        <p className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
          {submitError}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-zinc-100 px-4 py-2.5 font-medium text-zinc-950 disabled:opacity-60"
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-zinc-700 px-4 py-2.5 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
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
