from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models


class Vehicle(models.Model):
    """Represent a vehicle owned by a SpecSheet user."""

    class VehicleType(models.TextChoices):
        CAR = "car", "Car"
        MOTORCYCLE = "motorcycle", "Motorcycle"
        TRUCK = "truck", "Truck"

    class VehicleStatus(models.TextChoices):
        ACTIVE = "active", "Active"
        STORED = "stored", "Stored"
        SOLD = "sold", "Sold"
        ARCHIVED = "archived", "Archived"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="vehicles",
    )

    vehicle_type = models.CharField(
        max_length=20,
        choices=VehicleType.choices,
    )

    status = models.CharField(
        max_length=20,
        choices=VehicleStatus.choices,
        default=VehicleStatus.ACTIVE,
    )

    year = models.PositiveSmallIntegerField()
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    trim = models.CharField(max_length=100, blank=True)

    nickname = models.CharField(
        max_length=100,
        blank=True,
    )

    vin = models.CharField(
        max_length=17,
        blank=True,
    )

    current_mileage = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0)],
    )

    purchase_date = models.DateField(
        null=True,
        blank=True,
    )

    purchase_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
    )

    purchase_mileage = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.year} {self.make} {self.model}"
