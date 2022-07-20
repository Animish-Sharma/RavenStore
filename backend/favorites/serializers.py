from .models import FavoriteItem,Favorite
from rest_framework import serializers
from django.contrib.auth import get_user_model
from product.serializers import ProductSerializer

User = get_user_model()

class FavoriteItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    class Meta:
        model = FavoriteItem
        fields = ['user','product']
    def get_product(self,obj):
        return ProductSerializer(obj.product).data
    def get_user(self,obj):
        user = User.objects.get(email=obj.user.email)
        return user.username

class FavoriteSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    items = serializers.SerializerMethodField()
    class Meta:
        model = Favorite
        fields = ['user','add_date','items']

    def get_user(self,obj):
        user = User.objects.get(email=obj.user.email)
        return user.username
    def get_items(self,obj):
        return FavoriteItemSerializer(obj.items.all(),many=True).data   