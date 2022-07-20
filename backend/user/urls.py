from django.urls import path
from .views import PasswordResetView,PasswordResetCodeSubmit,AuthPasswordReset
urlpatterns = [
    path("reset/",PasswordResetCodeSubmit.as_view()),
    path("confirm/",PasswordResetView.as_view()),
    path("user/",AuthPasswordReset.as_view())
]
