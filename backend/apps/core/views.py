from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def health_check(request):
    """Return a simple response confirming the API is available."""

    return Response(
        {
            "status": "ok",
            "service": "specsheet-api",
        }
    )
