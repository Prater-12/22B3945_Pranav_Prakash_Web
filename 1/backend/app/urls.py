from django.urls import path
from .views import LoginView, AddUserView, LogoutView, DocumentViewSet

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("add-user/", AddUserView.as_view(), name="add-user"),
    path("doc/", DocumentViewSet.as_view(), name="docs"),
]
