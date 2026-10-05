import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


@pytest.mark.django_db
def test_user_can_register(client):
    response = client.post(
        reverse("register"),
        {
            "username": "oliver",
            "email": "oliver@example.com",
            "password": "strongpassword123",
        },
        content_type="application/json",
    )

    assert response.status_code == 201
    assert User.objects.filter(username="oliver").exists()
    assert "password" not in response.json()


@pytest.mark.django_db
def test_duplicate_username_is_rejected(client):
    User.objects.create_user(
        username="oliver",
        email="first@example.com",
        password="strongpassword123",
    )

    response = client.post(
        reverse("register"),
        {
            "username": "oliver",
            "email": "second@example.com",
            "password": "anotherstrongpassword123",
        },
        content_type="application/json",
    )

    assert response.status_code == 400
    assert "username" in response.json()


@pytest.mark.django_db
def test_user_can_login(client):
    User.objects.create_user(
        username="oliver",
        email="oliver@example.com",
        password="strongpassword123",
    )

    response = client.post(
        reverse("login"),
        {
            "username": "oliver",
            "password": "strongpassword123",
        },
        content_type="application/json",
    )

    assert response.status_code == 200
    assert "access" in response.json()
    assert "refresh" in response.json()


@pytest.mark.django_db
def test_invalid_login_is_rejected(client):
    User.objects.create_user(
        username="oliver",
        email="oliver@example.com",
        password="strongpassword123",
    )

    response = client.post(
        reverse("login"),
        {
            "username": "oliver",
            "password": "wrongpassword",
        },
        content_type="application/json",
    )

    assert response.status_code == 401


@pytest.mark.django_db
def test_me_requires_authentication(client):
    response = client.get(reverse("current-user"))

    assert response.status_code == 401


@pytest.mark.django_db
def test_authenticated_user_can_access_me(client):
    user = User.objects.create_user(
        username="oliver",
        email="oliver@example.com",
        password="strongpassword123",
    )

    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    response = client.get(
        reverse("current-user"),
        HTTP_AUTHORIZATION=f"Bearer {access_token}",
    )

    assert response.status_code == 200
    assert response.json() == {
        "id": user.id,
        "username": "oliver",
        "email": "oliver@example.com",
    }


@pytest.mark.django_db
def test_logout_blacklists_refresh_token(client):
    user = User.objects.create_user(
        username="oliver",
        email="oliver@example.com",
        password="strongpassword123",
    )

    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    response = client.post(
        reverse("logout"),
        {"refresh": str(refresh)},
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {access_token}",
    )

    assert response.status_code == 204
