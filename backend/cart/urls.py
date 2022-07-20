from django.urls import path,include
from .views import *
urlpatterns = [
    path("",CartView.as_view()),
    path("add/",AddToCart.as_view()),
    path("remove/",RemoveFromCart.as_view()),
    path("count/", CountCart.as_view()),
    path("coupon/",CouponApply.as_view()),
    path("coupon/remove/",CouponRemove.as_view()),
    path("delete/",CartDelete.as_view()),
    path("item/delete/",CartItemDelete.as_view()),
    path("buynow/",BuyNowView.as_view()),
]
