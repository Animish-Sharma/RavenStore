from django.urls import path
from .views import *


urlpatterns = [
    path("",CreateAddressView.as_view()),
    path("update/",AddressUpdateView.as_view()),
    path("delete/",DeleteAddress.as_view()),
    path("user/",UserAddress.as_view()),
    path("delivery/",ChangeDeliveryType.as_view())
]