import pytest

from apps.vehicles.serializers import VehicleSerializer


@pytest.mark.parametrize(
    "year",
    [
        1800,
        9999,
    ],
)
def test_vehicle_rejects_invalid_year(year):
    serializer = VehicleSerializer(
        data={
            "vehicle_type": "car",
            "year": year,
            "make": "Toyota",
            "model": "Supra",
            "current_mileage": 0,
        }
    )

    assert not serializer.is_valid()
    assert "year" in serializer.errors


def test_vehicle_normalizes_vin():
    serializer = VehicleSerializer(
        data={
            "vehicle_type": "car",
            "year": 2020,
            "make": "Toyota",
            "model": "Supra",
            "vin": "1hgcm82633a004352",
            "current_mileage": 0,
        }
    )

    assert serializer.is_valid(), serializer.errors
    assert serializer.validated_data["vin"] == "1HGCM82633A004352"


def test_vehicle_rejects_invalid_vin_length():
    serializer = VehicleSerializer(
        data={
            "vehicle_type": "car",
            "year": 2020,
            "make": "Toyota",
            "model": "Supra",
            "vin": "ABC123",
            "current_mileage": 0,
        }
    )

    assert not serializer.is_valid()
    assert "vin" in serializer.errors


def test_vehicle_allows_empty_vin():
    serializer = VehicleSerializer(
        data={
            "vehicle_type": "car",
            "year": 2020,
            "make": "Toyota",
            "model": "Supra",
            "vin": "",
            "current_mileage": 0,
        }
    )

    assert serializer.is_valid(), serializer.errors
