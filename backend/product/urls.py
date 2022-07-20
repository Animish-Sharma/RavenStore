from django.urls import path,include
from .views import *
urlpatterns = [
    path("products/",ProductList.as_view()),
    path("search/",ProductSearchView.as_view()),
    path("category/",CategoryView.as_view()),
    path("product/<slug>/",ProductDetail.as_view()),
    path("reviews/",include("reviews.urls")),
    path("cart/",include("cart.urls")),
    path("address/",include("address.urls")),
    path("favorites/",include("favorites.urls")),
    path("payment/",include("payment.urls")),
    path("password/",include("user.urls")),
    path("orders/",include("orders.urls")),
    path("featured/",FeaturedProduct.as_view()),
]
 