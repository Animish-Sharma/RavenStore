from django.urls import path,include
from .views import *
urlpatterns = [
    path("delete/",ReviewDeleteView.as_view()),
    path("create/",ReviewCreateView.as_view()),
    path("edit/",ReviewEditView.as_view()),
    path("liked/",ReviewLikeView.as_view()),
    path("disliked/",ReviewDislikeView.as_view()),
    path("likes/",LikeView.as_view()),
    path("<slug>/",ReviewListView.as_view()),
]
