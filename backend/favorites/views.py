from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from .serializers import FavoriteSerializer
from rest_framework import permissions
from product.models import Product
from rest_framework.response import Response
from .models import Favorite,FavoriteItem
# Create your views here.
class FavoriteListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request,format=None):
        list_product = [total for total in Favorite.objects.filter(user=request.user)]
        serializer = FavoriteSerializer(list_product,many=True)
        if(len(serializer.data) != 0):
            return Response(serializer.data[0])
        return Response({"error":"No favorite items"})

class AddToFavoriteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        data = self.request.data
        slug = data['slug']

        product = Product.objects.get(slug=slug)
        favorite_item = FavoriteItem.objects.filter(user=self.request.user,product=product)
        if favorite_item.exists():
            return Response({ "message":"Item already exists in favorites" })
        else:
            favorite_item = FavoriteItem.objects.create(product=product,user=self.request.user)
        
        favorite_qs = Favorite.objects.filter(user=self.request.user)
        if favorite_qs.exists():
            favorite = favorite_qs[0]
            if not favorite.items.filter(product__id=favorite_item.product.id).exists():
                favorite.items.add(favorite_item)
        else:
            favorite = Favorite.objects.create(user=self.request.user)
            favorite.items.add(favorite_item)
            favorite.save()
        return Response({ "success":"Item added to favorites" })

class RemoveAllFav(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def delete(self, request, format=None):
        fav_i = Favorite.objects.filter(user=self.request.user)
        if(fav_i.exists()):
            fav = fav_i[0]
            for item in fav.items.all():
                item.delete()
            fav.delete()
        return Response({ "error": 'An error occurred' })

class RemoveFavorite(APIView):
    def post(self,request,format=None):
        slug = self.request.data['slug']
        if slug is None:
            return Response({ "error":"Data was not provided" })
        product = Product.objects.get(slug=slug)
        favorite_qs = Favorite.objects.filter(user=request.user)
        if favorite_qs.exists():
            favorite = favorite_qs[0]
            if favorite.items.filter(product__slug=product.slug).exists():
                favorite_item = FavoriteItem.objects.filter(user=request.user,product=product)[0]
                favorite.items.remove(favorite_item)
                favorite_item.delete()

                if favorite.items.count() <= 0:
                    favorite.delete()
                return Response({ "success":"Item Removed from Favorite" })
            else:
                return Response({ "error":"This item was not in your favorite list" })

        else:
            return Response({ "error":"You don't have an favorite list" })