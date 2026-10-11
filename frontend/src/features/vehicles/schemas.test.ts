import { describe, expect, it } from "vitest";

import { vehicleSchema } from "./schemas";

describe("vehicleSchema", () => {
  it("accepts a valid vehicle", () => {
    const result = vehicleSchema.safeParse({
      vehicle_type: "motorcycle",
      status: "active",
      year: 2006,
      make: "Honda",
      model: "CBR600RR",
      trim: "",
      nickname: "CBR",
      vin: "",
      current_mileage: 18000,
    });

    expect(result.success).toBe(true);
  });

  it("rejects a negative mileage", () => {
    const result = vehicleSchema.safeParse({
      vehicle_type: "car",
      status: "active",
      year: 2020,
      make: "Toyota",
      model: "Supra",
      vin: "",
      current_mileage: -1,
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid year", () => {
    const result = vehicleSchema.safeParse({
      vehicle_type: "car",
      status: "active",
      year: 1800,
      make: "Toyota",
      model: "Supra",
      vin: "",
      current_mileage: 0,
    });

    expect(result.success).toBe(false);
  });

  it("rejects a VIN with the wrong length", () => {
    const result = vehicleSchema.safeParse({
      vehicle_type: "car",
      status: "active",
      year: 2020,
      make: "Toyota",
      model: "Supra",
      vin: "12345",
      current_mileage: 0,
    });

    expect(result.success).toBe(false);
  });

  it("accepts vehicle purchase information", () => {
    const result = vehicleSchema.safeParse({
      vehicle_type: "motorcycle",
      status: "active",
      year: 2006,
      make: "Honda",
      model: "CBR600RR",
      vin: "",
      current_mileage: 18000,
      purchase_date: "2026-09-01",
      purchase_price: 4500,
      purchase_mileage: 17999,
    });

    expect(result.success).toBe(true);
  });

  it("rejects a negative purchase price", () => {
    const result = vehicleSchema.safeParse({
      vehicle_type: "car",
      status: "active",
      year: 2020,
      make: "Toyota",
      model: "Supra",
      vin: "",
      current_mileage: 10000,
      purchase_price: -100,
    });

    expect(result.success).toBe(false);
  });
});
