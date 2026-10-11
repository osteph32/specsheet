import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../auth/useAuth";
import { getVehicles } from "./api";

export const vehicleQueryKey = ["vehicles"];

export function useVehicles() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: vehicleQueryKey,
    queryFn: () => {
      if (!accessToken) {
        throw new Error("An access token is required.");
      }

      return getVehicles(accessToken);
    },
    enabled: Boolean(accessToken),
  });
}
