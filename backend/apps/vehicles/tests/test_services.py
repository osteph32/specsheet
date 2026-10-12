from unittest.mock import Mock, patch

import pytest

from apps.vehicles.services import (
    VinDecodeError,
    decode_vin,
)


@patch("apps.vehicles.services.requests.get")
def test_decode_vin_normalizes_nhtsa_response(mock_get):
    response = Mock()
    response.raise_for_status.return_value = None
    response.json.return_value = {
        "Results": [
            {
                "ErrorCode": "0",
                "Make": "HONDA",
                "Model": "Accord",
                "ModelYear": "2003",
                "Trim": "EX",
                "VehicleType": "PASSENGER CAR",
            }
        ]
    }

    mock_get.return_value = response

    result = decode_vin("1hgcm82633a004352")

    assert result.vin == "1HGCM82633A004352"
    assert result.year == 2003
    assert result.make == "HONDA"
    assert result.model == "Accord"
    assert result.trim == "EX"
    assert result.vehicle_type == "car"


@patch("apps.vehicles.services.requests.get")
def test_decode_vin_maps_motorcycle(mock_get):
    response = Mock()
    response.raise_for_status.return_value = None
    response.json.return_value = {
        "Results": [
            {
                "ErrorCode": "0",
                "Make": "HONDA",
                "Model": "CBR600RR",
                "ModelYear": "2006",
                "Trim": "",
                "VehicleType": "MOTORCYCLE",
            }
        ]
    }

    mock_get.return_value = response

    result = decode_vin("JH2PC37096M000001")

    assert result.vehicle_type == "motorcycle"


@patch("apps.vehicles.services.requests.get")
def test_decode_vin_rejects_nhtsa_error(mock_get):
    response = Mock()
    response.raise_for_status.return_value = None
    response.json.return_value = {
        "Results": [
            {
                "ErrorCode": "6",
                "ErrorText": "Incomplete VIN",
            }
        ]
    }

    mock_get.return_value = response

    with pytest.raises(VinDecodeError):
        decode_vin("1HGCM82633A004352")


@patch("apps.vehicles.services.requests.get")
def test_decode_vin_handles_invalid_response(mock_get):
    response = Mock()
    response.raise_for_status.return_value = None
    response.json.return_value = {
        "Results": [],
    }

    mock_get.return_value = response

    with pytest.raises(VinDecodeError):
        decode_vin("1HGCM82633A004352")
