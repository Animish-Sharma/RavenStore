from rest_framework import serializers
from .models import Cart,CartItem
from coupon.models import *
from product.serializers import ProductSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()
    difference = serializers.SerializerMethodField()
    discount_price = serializers.SerializerMethodField()
    class Meta:
        model = CartItem
        fields = ['id','product','quantity','total_price','difference','discount_price']

    def get_product(self,obj):
        return ProductSerializer(obj.product).data

    def get_total_price(self,obj):
        return obj.get_total_price()

    def get_difference(self,obj):
        return obj.get_difference()
    def get_discount_price(self,obj):
        return obj.get_discount_price()

class CartSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField()
    items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['total','items','coupon']

    def get_total(self,obj):
        if obj.coupon != "":
            temp = obj.get_total()
            s_coupon = Coupon.objects.filter(code=obj.coupon)
            if not (s_coupon.exists()):
                sp_coupon = PercentageCoupon.objects.filter(code=obj.coupon)
                if not sp_coupon.exists():
                    obj.coupon = ""
                    return obj.get_total()
                else:
                    p_coupon = sp_coupon[0]
                    total = (temp * (100-p_coupon.percentage_off)) / 100
                    return total
            else:
                coupon = s_coupon[0]
                total = temp - coupon.amount
                return total
        else: 
            return obj.get_total()

    def get_items(self,obj):
        return CartItemSerializer(obj.items.all(),many=True).data          