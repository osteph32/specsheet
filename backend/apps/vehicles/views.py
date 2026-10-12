from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.vehicles.models import Vehicle
from apps.vehicles.serializers import (
    VehicleSerializer,
    VinDecodeSerializer,
)
from apps.vehicles.services import VinDecodeError, decode_vin


class VehicleViewSet(viewsets.ModelViewSet):
    """Provide CRUD operations for vehicles owned by the current user."""

    serializer_class = VehicleSerializer

    def get_queryset(self):
        queryset = Vehicle.objects.filter(owner=self.request.user)

        vehicle_type = self.request.query_params.get("vehicle_type")
        status = self.request.query_params.get("status")

        if vehicle_type:
            queryset = queryset.filter(vehicle_type=vehicle_type)

        if status:
            queryset = queryset.filter(status=status)

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(
        detail=False,
        methods=["post"],
        url_path="decode-vin",
    )
    def decode_vin_action(self, request):
        serializer = VinDecodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            decoded_vehicle = decode_vin(serializer.validated_data["vin"])
        except VinDecodeError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(decoded_vehicle.to_dict())
