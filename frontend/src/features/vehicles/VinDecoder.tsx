import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { useAuth } from "../auth/useAuth";
import { decodeVin } from "./api";
import type { DecodedVehicle } from "./types";

interface VinDecoderProps {
  vin: string;
  onApply: (vehicle: DecodedVehicle) => void;
}

export function VinDecoder({ vin, onApply }: VinDecoderProps) {
  const { accessToken } = useAuth();

  const [decodedVehicle, setDecodedVehicle] = useState<DecodedVehicle | null>(
    null,
  );

  const decodeMutation = useMutation({
    mutationFn: () => {
      if (!accessToken) {
        throw new Error("An access token is required.");
      }

      return decodeVin(accessToken, vin);
    },

    onSuccess: (result) => {
      setDecodedVehicle(result);
    },
  });

  const canDecode = vin.trim().length === 17;

  return (
    <div className="space-y-4">
      <button
        type="button"
        disabled={!canDecode || decodeMutation.isPending}
        onClick={() => decodeMutation.mutate()}
        className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {decodeMutation.isPending ? "Decoding..." : "Decode VIN"}
      </button>

      {decodeMutation.isError && (
        <p className="text-sm text-red-400">
          Unable to decode this VIN. You can continue entering the vehicle
          manually.
        </p>
      )}

      {decodedVehicle && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="font-medium">VIN decoded successfully</p>

          <dl className="mt-3 space-y-1 text-sm text-zinc-400">
            <div>
              <dt className="inline">Year: </dt>
              <dd className="inline">{decodedVehicle.year ?? "Unknown"}</dd>
            </div>

            <div>
              <dt className="inline">Make: </dt>
              <dd className="inline">{decodedVehicle.make || "Unknown"}</dd>
            </div>

            <div>
              <dt className="inline">Model: </dt>
              <dd className="inline">{decodedVehicle.model || "Unknown"}</dd>
            </div>

            <div>
              <dt className="inline">Trim: </dt>
              <dd className="inline">{decodedVehicle.trim || "Unknown"}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={() => onApply(decodedVehicle)}
            className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
          >
            Apply decoded values
          </button>
        </div>
      )}
    </div>
  );
}
