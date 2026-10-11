import { z } from "zod";

const currentYear = new Date().getFullYear();

export const vehicleSchema = z.object({
  vehicle_type: z.enum(["car", "motorcycle", "truck"]),
  year: z.coerce
    .number()
    .int()
    .min(1886, "Enter a valid vehicle year.")
    .max(currentYear + 1, `Year cannot be later than ${currentYear + 1}.`),
  make: z.string().trim().min(1, "Make is required."),
  model: z.string().trim().min(1, "Model is required."),
  trim: z.string().trim().optional(),
  nickname: z.string().trim().optional(),
  vin: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || value.length === 17,
      "VIN must contain exactly 17 characters.",
    ),
  current_mileage: z.coerce
    .number()
    .int()
    .min(0, "Mileage cannot be negative."),
});

export type VehicleFormInput = z.input<typeof vehicleSchema>;
export type VehicleFormValues = z.output<typeof vehicleSchema>;
