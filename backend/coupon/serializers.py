from .models import Coupon,PercentageCoupon
from rest_framework import serializers


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ['code','amount']

class PercentageCouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = PercentageCoupon
        fields = ['code','percentage_off']