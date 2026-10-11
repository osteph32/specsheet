import { apiRequest } from "../../api/client";
import type { CreateVehiclePayload, Vehicle } from "./types";

export function getVehicles(accessToken: string): Promise<Vehicle[]> {
  return apiRequest<Vehicle[]>("/api/vehicles/", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function createVehicle(
  accessToken: string,
  payload: CreateVehiclePayload,
): Promise<Vehicle> {
  return apiRequest<Vehicle>("/api/vehicles/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
}

export function deleteVehicle(
  accessToken: string,
  vehicleId: number,
): Promise<void> {
  return apiRequest<void>(`/api/vehicles/${vehicleId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getVehicle(
  accessToken: string,
  vehicleId: number,
): Promise<Vehicle> {
  return apiRequest<Vehicle>(`/api/vehicles/${vehicleId}/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function updateVehicle(
  accessToken: string,
  vehicleId: number,
  payload: CreateVehiclePayload,
): Promise<Vehicle> {
  return apiRequest<Vehicle>(`/api/vehicles/${vehicleId}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
}
