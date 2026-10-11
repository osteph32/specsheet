import pytest
from django.contrib.auth import get_user_model

from apps.vehicles.models import Vehicle

User = get_user_model()


@pytest.mark.django_db
def test_vehicle_belongs_to_user():
    user = User.objects.create_user(
        username="testuser",
        password="strongpassword123",
    )

    vehicle = Vehicle.objects.create(
        owner=user,
        vehicle_type=Vehicle.VehicleType.MOTORCYCLE,
        year=2006,
        make="Honda",
        model="CBR600RR",
        current_mileage=18000,
    )

    assert vehicle.owner == user
    assert vehicle in user.vehicles.all()


@pytest.mark.django_db
def test_vehicle_string_representation():
    user = User.objects.create_user(
        username="testuser",
        password="strongpassword123",
    )

    vehicle = Vehicle.objects.create(
        owner=user,
        vehicle_type=Vehicle.VehicleType.CAR,
        year=2020,
        make="Toyota",
        model="Supra",
    )

    assert str(vehicle) == "2020 Toyota Supra"
