from rest_framework import viewsets

from apps.vehicles.models import Vehicle
from apps.vehicles.serializers import VehicleSerializer


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
