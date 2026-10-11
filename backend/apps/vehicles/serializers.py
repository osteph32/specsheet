from datetime import date

from rest_framework import serializers

from apps.vehicles.models import Vehicle


class VehicleSerializer(serializers.ModelSerializer):
    """Serialize and validate vehicles owned by the authenticated user."""

    class Meta:
        model = Vehicle
        fields = (
            "id",
            "vehicle_type",
            "status",
            "year",
            "make",
            "model",
            "trim",
            "nickname",
            "vin",
            "current_mileage",
            "purchase_date",
            "purchase_price",
            "purchase_mileage",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
        )

    def validate_year(self, value: int) -> int:
        max_year = date.today().year + 1

        if value < 1886 or value > max_year:
            raise serializers.ValidationError(
                f"Year must be between 1886 and {max_year}."
            )

        return value

    def validate_vin(self, value: str) -> str:
        vin = value.strip().upper()

        if not vin:
            return ""

        if len(vin) != 17:
            raise serializers.ValidationError("VIN must contain exactly 17 characters.")

        if any(character in vin for character in ("I", "O", "Q")):
            raise serializers.ValidationError(
                "VIN cannot contain the letters I, O, or Q."
            )

        return vin
