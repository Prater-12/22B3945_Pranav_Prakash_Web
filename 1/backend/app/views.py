from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import SiteUser, Document
from django.contrib.auth import authenticate, login, logout
from django.db import transaction
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import PartialDocumentSerializer
from rest_framework import generics


class AddUserView(APIView):
    def post(self, request):
        password = "password"
        email = request.data.get("email")
        is_manager = bool(request.data.get("is_manager", False))

        if not request.user.siteuser.is_manager:
            return Response(
                {"error": "You are not allowed to create users."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if not password or not email:
            return Response(
                {"error": "Please provide email"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if is_manager and not request.user.is_superuser:
            return Response(
                {"error": "Only superusers can create manager users"},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            with transaction.atomic():
                user = User.objects.create_user(
                    username=email, password=password, email=email
                )
                SiteUser.objects.create(user=user)
            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED,
            )
        except:
            return Response(
                {"error": "Failed to register user"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        if request.user.is_authenticated:
            return Response(
                {"error": "User is already logged in"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "Please provide both username and password"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(username=username, password=password)

        if user is not None:
            site_user = SiteUser.objects.filter(user=user).first()

            if site_user is not None:
                login(request, user)
                return Response(
                    {"message": "User logged in successfully"},
                    status=status.HTTP_200_OK,
                )

        return Response(
            {"error": "Invalid username or password"},
            status=status.HTTP_401_UNAUTHORIZED,
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response(
            {"message": "User logged out successfully"}, status=status.HTTP_200_OK
        )


class DocumentViewSet(generics.ListCreateAPIView):
    queryset = Document.objects.all()
    serializer_class = PartialDocumentSerializer

    def get_queryset(self):
        site_user = self.request.user.siteuser
        if site_user.is_manager:
            return Document.objects.all().order_by("-updated_at")
        else:
            return Document.objects.filter(author=site_user).order_by(
                "-updated_at"
            ) | site_user.documents.all().order_by("-updated_at")

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
