from django.urls import path,include
from .views import *
urlpatterns = [
    path("", OrderList.as_view()),
    path("<pk>/",OrderDetail.as_view())
]
 