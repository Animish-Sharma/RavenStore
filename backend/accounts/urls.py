from django.urls import path,include
from .views import SignUpView,LoginView,UpdateView,DeleteAccount
urlpatterns = [
    path("signup/",SignUpView.as_view()),
    path("update/",UpdateView.as_view()),
    path("delete/",DeleteAccount.as_view()),
    path("",LoginView.as_view()),
]
