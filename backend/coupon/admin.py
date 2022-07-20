from django.contrib import admin
from .models import Coupon,PercentageCoupon
# Register your models here.
admin.site.register(Coupon)
admin.site.register(PercentageCoupon)