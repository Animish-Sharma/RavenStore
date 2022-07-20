from django.shortcuts import render
from rest_framework import permissions
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from .models import Reviews,Like
from .serializers import ReviewSerializer,LikeSerializer
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from product.models import Product
# Create your views here.

class LargeResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 20
    page_query_param = 'page'


class ReviewListView(ListAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class =  ReviewSerializer
    def get_queryset(self):
        slug = self.kwargs.get('slug')
        product = Product.objects.get(slug=slug)
        return Reviews.objects.filter(product=product)

class ReviewCreateView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self,request,format=None):
        data = self.request.data
        title = data['title']
        description = data['description']
        rating = data['rating']
        slug = data['slug']

        product = Product.objects.get(slug = slug)
        if(Reviews.objects.filter(user = self.request.user,product=product)).exists():
            return Response({ "error":"Already have a review " })
        
        Reviews.objects.create(title=title,description=description,rating=rating,user=self.request.user,product=product)
        return Response({ "success":"Successfully created a review" })

class ReviewEditView(APIView):
    def post(self,request,format=None):
        data = self.request.data
        title = data['title']
        description = data['description']
        rating = data['rating']
        slug = data['slug']

        product = Product.objects.get(slug=slug)

        review = Reviews.objects.get(user=self.request.user,product=product)
        if review.user.username == self.request.user.username:
            if len(title.strip(' ')) > 0:
                review.title = title

            if len(description.strip(' ')) > 0:
                review.description = description

            if rating != 0:
                review.rating = rating

            review.save()
            return Response({ "success":"Successfully Chnaged the Review" })
        return Response ({ "error":"You are not the user of this review,so you can't change it" })

class ReviewLikeView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def post(self,request,format=None):
        id_ = self.request.data['id']
        review = Reviews.objects.get(id=id_)
        likes = Like.objects.filter(user=self.request.user,review=review)
        if likes.exists():
            like = likes[0]
                
            likes[0].delete()
            if like.choice == "like":
                return Response({""})
        
        Like.objects.create(user=self.request.user,review=review,choice='like')

        return Response({ "success":"Review added successfully" })
class ReviewDislikeView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def post(self,request,format=None):
        id_ = self.request.data['id']

        review = Reviews.objects.get(id=id_)
        likes = Like.objects.filter(user=self.request.user,review=review)
        if likes.exists():
            like = likes[0]
                
            likes[0].delete()
            if like.choice == "dislike":
                return Response({""})
        
        Like.objects.create(user=self.request.user,review=review,choice='dislike', value= -1)

        return Response({ "success":"Review added successfully" })

class ReviewDeleteView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def post(self,request,format=None):
        data = self.request.data
        review_id = data['review_id']
        reviews = Reviews.objects.filter(id=review_id,user=self.request.user)
        if(reviews.exists()):
            review = reviews[0]
            review.delete()
            return Response({ "success" : "Successfully Deleted Review"})
        else:
            return Response({"error" : "Review does'nt exist"})

class LikeView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = LikeSerializer
    def get_queryset(self):
        arg = self.request.query_params.get("slug")
        product = Product.objects.get(slug=arg)
        return Like.objects.filter(user=self.request.user,review__product=product)