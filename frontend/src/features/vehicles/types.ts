export type VehicleType = "car" | "motorcycle" | "truck";

export type VehicleStatus = "active" | "stored" | "sold" | "archived";

export interface Vehicle {
  id: number;
  vehicle_type: VehicleType;
  status: VehicleStatus;
  year: number;
  make: string;
  model: string;
  trim: string;
  nickname: string;
  vin: string;
  current_mileage: number;
  purchase_date: string | null;
  purchase_price: string | null;
  purchase_mileage: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateVehiclePayload {
  vehicle_type: VehicleType;
  status: VehicleStatus;
  year: number;
  make: string;
  model: string;
  trim?: string;
  nickname?: string;
  vin?: string;
  current_mileage: number;
  purchase_date?: string | null;
  purchase_price?: number | null;
  purchase_mileage?: number | null;
}

export interface DecodedVehicle {
  vin: string;
  year: number | null;
  make: string;
  model: string;
  trim: string;
  vehicle_type: VehicleType | null;
}
