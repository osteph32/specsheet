from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer


class RegisterView(generics.CreateAPIView):
    """Register a new SpecSheet account."""

    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class CurrentUserView(APIView):
    """Return the currently authenticated user."""

    def get(self, request):
        return Response(
            {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
            }
        )


class LogoutView(APIView):
    """Invalidate a refresh token so it cannot be reused."""

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token is required."},
                status=400,
            )

        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response(status=204)
