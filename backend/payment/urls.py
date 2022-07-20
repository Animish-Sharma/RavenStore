from django.urls import path,include
from .views import *
urlpatterns = [
    path("", CreateIndent.as_view()),
    path("success/",SuccessPayment.as_view()),
    path("refund/",RefundView.as_view())
]
 