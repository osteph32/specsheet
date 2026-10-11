import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from apps.vehicles.models import Vehicle

User = get_user_model()


def authenticated_client(user):
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client


@pytest.mark.django_db
def test_user_can_create_vehicle():
    user = User.objects.create_user(
        username="owner",
        password="strongpassword123",
    )
    client = authenticated_client(user)

    response = client.post(
        "/api/vehicles/",
        {
            "vehicle_type": "motorcycle",
            "year": 2006,
            "make": "Honda",
            "model": "CBR600RR",
            "trim": "",
            "nickname": "CBR",
            "vin": "",
            "current_mileage": 18000,
        },
        format="json",
    )

    assert response.status_code == 201

    vehicle = Vehicle.objects.get()

    assert vehicle.owner == user
    assert vehicle.make == "Honda"


@pytest.mark.django_db
def test_user_only_sees_their_own_vehicles():
    first_user = User.objects.create_user(
        username="first",
        password="strongpassword123",
    )
    second_user = User.objects.create_user(
        username="second",
        password="strongpassword123",
    )

    Vehicle.objects.create(
        owner=first_user,
        vehicle_type=Vehicle.VehicleType.CAR,
        year=2020,
        make="Toyota",
        model="Supra",
    )

    Vehicle.objects.create(
        owner=second_user,
        vehicle_type=Vehicle.VehicleType.MOTORCYCLE,
        year=2006,
        make="Honda",
        model="CBR600RR",
    )

    client = authenticated_client(first_user)

    response = client.get("/api/vehicles/")

    assert response.status_code == 200

    results = response.json()

    assert len(results) == 1
    assert results[0]["make"] == "Toyota"


@pytest.mark.django_db
def test_user_cannot_access_another_users_vehicle():
    owner = User.objects.create_user(
        username="owner",
        password="strongpassword123",
    )
    other_user = User.objects.create_user(
        username="other",
        password="strongpassword123",
    )

    vehicle = Vehicle.objects.create(
        owner=owner,
        vehicle_type=Vehicle.VehicleType.TRUCK,
        year=2022,
        make="Ford",
        model="F-150",
    )

    client = authenticated_client(other_user)

    response = client.get(f"/api/vehicles/{vehicle.id}/")

    assert response.status_code == 404


@pytest.mark.django_db
def test_unauthenticated_user_cannot_access_vehicles():
    client = APIClient()

    response = client.get("/api/vehicles/")

    assert response.status_code == 401


@pytest.mark.django_db
def test_user_can_update_their_vehicle():
    user = User.objects.create_user(
        username="owner",
        password="strongpassword123",
    )

    vehicle = Vehicle.objects.create(
        owner=user,
        vehicle_type=Vehicle.VehicleType.CAR,
        year=2020,
        make="Toyota",
        model="Supra",
        current_mileage=10000,
    )

    client = authenticated_client(user)

    response = client.patch(
        f"/api/vehicles/{vehicle.id}/",
        {
            "nickname": "Weekend Car",
            "current_mileage": 12000,
        },
        format="json",
    )

    assert response.status_code == 200

    vehicle.refresh_from_db()

    assert vehicle.nickname == "Weekend Car"
    assert vehicle.current_mileage == 12000


@pytest.mark.django_db
def test_user_can_delete_their_vehicle():
    user = User.objects.create_user(
        username="owner",
        password="strongpassword123",
    )

    vehicle = Vehicle.objects.create(
        owner=user,
        vehicle_type=Vehicle.VehicleType.MOTORCYCLE,
        year=2006,
        make="Honda",
        model="CBR600RR",
    )

    client = authenticated_client(user)

    response = client.delete(
        f"/api/vehicles/{vehicle.id}/",
    )

    assert response.status_code == 204
    assert not Vehicle.objects.filter(id=vehicle.id).exists()


@pytest.mark.django_db
def test_user_cannot_update_another_users_vehicle():
    owner = User.objects.create_user(
        username="owner",
        password="strongpassword123",
    )

    other_user = User.objects.create_user(
        username="other",
        password="strongpassword123",
    )

    vehicle = Vehicle.objects.create(
        owner=owner,
        vehicle_type=Vehicle.VehicleType.CAR,
        year=2020,
        make="Toyota",
        model="Supra",
    )

    client = authenticated_client(other_user)

    response = client.patch(
        f"/api/vehicles/{vehicle.id}/",
        {
            "nickname": "Stolen",
        },
        format="json",
    )

    assert response.status_code == 404

    vehicle.refresh_from_db()

    assert vehicle.nickname == ""


@pytest.mark.django_db
def test_user_cannot_delete_another_users_vehicle():
    owner = User.objects.create_user(
        username="owner",
        password="strongpassword123",
    )

    other_user = User.objects.create_user(
        username="other",
        password="strongpassword123",
    )

    vehicle = Vehicle.objects.create(
        owner=owner,
        vehicle_type=Vehicle.VehicleType.TRUCK,
        year=2022,
        make="Ford",
        model="F-150",
    )

    client = authenticated_client(other_user)

    response = client.delete(
        f"/api/vehicles/{vehicle.id}/",
    )

    assert response.status_code == 404
    assert Vehicle.objects.filter(id=vehicle.id).exists()


@pytest.mark.django_db
def test_vehicle_response_does_not_expose_owner():
    user = User.objects.create_user(
        username="owner",
        password="strongpassword123",
    )

    Vehicle.objects.create(
        owner=user,
        vehicle_type=Vehicle.VehicleType.CAR,
        year=2020,
        make="Toyota",
        model="Supra",
    )

    client = authenticated_client(user)

    response = client.get("/api/vehicles/")

    assert response.status_code == 200
    assert "owner" not in response.json()[0]


@pytest.mark.django_db
def test_vehicle_defaults_to_active_status():
    user = User.objects.create_user(
        username="owner",
        password="strongpassword123",
    )

    client = authenticated_client(user)

    response = client.post(
        "/api/vehicles/",
        {
            "vehicle_type": "car",
            "year": 2020,
            "make": "Toyota",
            "model": "Supra",
            "current_mileage": 10000,
        },
        format="json",
    )

    assert response.status_code == 201
    assert response.json()["status"] == "active"


@pytest.mark.django_db
def test_user_can_save_purchase_information():
    user = User.objects.create_user(
        username="owner",
        password="strongpassword123",
    )

    client = authenticated_client(user)

    response = client.post(
        "/api/vehicles/",
        {
            "vehicle_type": "motorcycle",
            "status": "active",
            "year": 2006,
            "make": "Honda",
            "model": "CBR600RR",
            "current_mileage": 18000,
            "purchase_date": "2026-09-01",
            "purchase_price": "4500.00",
            "purchase_mileage": 17999,
        },
        format="json",
    )

    assert response.status_code == 201

    vehicle = Vehicle.objects.get()

    assert str(vehicle.purchase_price) == "4500.00"
    assert vehicle.purchase_mileage == 17999


@pytest.mark.django_db
def test_vehicle_list_can_filter_by_status():
    user = User.objects.create_user(
        username="owner",
        password="strongpassword123",
    )

    Vehicle.objects.create(
        owner=user,
        vehicle_type=Vehicle.VehicleType.CAR,
        status=Vehicle.VehicleStatus.ACTIVE,
        year=2020,
        make="Toyota",
        model="Supra",
    )

    Vehicle.objects.create(
        owner=user,
        vehicle_type=Vehicle.VehicleType.TRUCK,
        status=Vehicle.VehicleStatus.SOLD,
        year=2021,
        make="Ford",
        model="F-150",
    )

    client = authenticated_client(user)

    response = client.get("/api/vehicles/?status=active")

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["model"] == "Supra"


@pytest.mark.django_db
def test_vehicle_list_can_filter_by_type():
    user = User.objects.create_user(
        username="owner",
        password="strongpassword123",
    )

    Vehicle.objects.create(
        owner=user,
        vehicle_type=Vehicle.VehicleType.MOTORCYCLE,
        year=2006,
        make="Honda",
        model="CBR600RR",
    )

    Vehicle.objects.create(
        owner=user,
        vehicle_type=Vehicle.VehicleType.CAR,
        year=2020,
        make="Toyota",
        model="Supra",
    )

    client = authenticated_client(user)

    response = client.get("/api/vehicles/?vehicle_type=motorcycle")

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["model"] == "CBR600RR"
