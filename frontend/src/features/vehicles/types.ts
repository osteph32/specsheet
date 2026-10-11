export type VehicleType = "car" | "motorcycle" | "truck";

export interface Vehicle {
  id: number;
  vehicle_type: VehicleType;
  year: number;
  make: string;
  model: string;
  trim: string;
  nickname: string;
  vin: string;
  current_mileage: number;
  created_at: string;
  updated_at: string;
}

export interface CreateVehiclePayload {
  vehicle_type: VehicleType;
  year: number;
  make: string;
  model: string;
  trim?: string;
  nickname?: string;
  vin?: string;
  current_mileage: number;
}
