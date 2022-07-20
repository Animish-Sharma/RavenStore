from django.urls import path
from .views import FavoriteListView,AddToFavoriteView,RemoveAllFav,RemoveFavorite

urlpatterns = [
    path("",FavoriteListView.as_view()),
    path("add/",AddToFavoriteView.as_view()),
    path("remove/",RemoveFavorite.as_view()),
    path("all/",RemoveAllFav.as_view()),
]