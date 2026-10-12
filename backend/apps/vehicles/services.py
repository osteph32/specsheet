from dataclasses import asdict, dataclass
from typing import Any

import requests

NHTSA_VIN_URL = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/{vin}"


@dataclass(frozen=True)
class DecodedVehicle:
    vin: str
    year: int | None
    make: str
    model: str
    trim: str
    vehicle_type: str | None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


class VinDecodeError(Exception):
    """Raised when a VIN cannot be decoded."""


def decode_vin(vin: str) -> DecodedVehicle:
    """Decode a VIN through NHTSA and normalize the result for SpecSheet."""

    normalized_vin = vin.strip().upper()

    try:
        response = requests.get(
            NHTSA_VIN_URL.format(vin=normalized_vin),
            params={"format": "json"},
            timeout=5,
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        raise VinDecodeError("The VIN decoding service is unavailable.") from exc

    try:
        payload = response.json()
        results = payload["Results"]
        result = results[0]
    except (ValueError, KeyError, IndexError, TypeError) as exc:
        raise VinDecodeError(
            "The VIN decoding service returned an invalid response."
        ) from exc

    _validate_decode_result(result)

    return DecodedVehicle(
        vin=normalized_vin,
        year=_parse_year(result.get("ModelYear")),
        make=_clean_value(result.get("Make")),
        model=_clean_value(result.get("Model")),
        trim=_clean_value(result.get("Trim")),
        vehicle_type=_map_vehicle_type(result.get("VehicleType")),
    )


def _validate_decode_result(result: dict[str, Any]) -> None:
    error_code = str(result.get("ErrorCode", "")).strip()

    if not error_code or error_code == "0":
        return

    error_text = _clean_value(result.get("ErrorText"))

    raise VinDecodeError(error_text or "The VIN could not be decoded.")


def _clean_value(value: Any) -> str:
    if value is None:
        return ""

    return str(value).strip()


def _parse_year(value: Any) -> int | None:
    cleaned_value = _clean_value(value)

    if not cleaned_value:
        return None

    try:
        return int(cleaned_value)
    except ValueError:
        return None


def _map_vehicle_type(value: Any) -> str | None:
    vehicle_type = _clean_value(value).lower()

    if not vehicle_type:
        return None

    if "motorcycle" in vehicle_type:
        return "motorcycle"

    if "truck" in vehicle_type:
        return "truck"

    if (
        "passenger car" in vehicle_type
        or "multipurpose passenger vehicle" in vehicle_type
    ):
        return "car"

    return None
