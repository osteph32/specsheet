import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../auth/useAuth";
import { getVehicle } from "./api";

export function vehicleDetailQueryKey(vehicleId: number) {
  return ["vehicles", vehicleId] as const;
}

export function useVehicle(vehicleId: number) {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: vehicleDetailQueryKey(vehicleId),
    queryFn: () => {
      if (!accessToken) {
        throw new Error("An access token is required.");
      }

      return getVehicle(accessToken, vehicleId);
    },
    enabled: Boolean(accessToken) && vehicleId > 0,
  });
}
