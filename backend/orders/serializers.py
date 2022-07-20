from rest_framework import serializers
from .models import Order,OrderItem,Refund
from django.contrib.auth import get_user_model
from product.serializers import *
from delivery.serializers import DeliverySerializer
from delivery.models import Delivery

User = get_user_model()

class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    class Meta:
        model = OrderItem
        fields = ['id','product','quantity','user']

    def get_user(self,obj):
        user = User.objects.get(email=obj.user.email)
        return user.username

    def get_product(self,obj):
        return ProductSerializer(obj.product).data

class OrderSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    items = serializers.SerializerMethodField()
    delivery = serializers.SerializerMethodField()
    class Meta:
        model = Order
        fields = ['id'
        ,'order_id'
        ,'user'
        ,'status'
        ,'stripe_id'
        ,'address'
        ,'delivery'
        ,'total_price'
        ,'ordered_date'
        ,'items'
        ,'refund_id'
        ,"coupon"
        ,"receipt"
        ]

    def get_user(self,obj):
        user = User.objects.get(email=obj.user.email)
        return user.username
    def get_delivery(self,obj):
        delivery = Delivery.objects.get(delivery_id=obj.delivery.delivery_id)

        return DeliverySerializer(delivery).data
    def get_items(self,obj):
        return OrderItemSerializer(obj.items.all(),many=True).data