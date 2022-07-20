from rest_framework import serializers
from .models import Address
from django_countries.serializers import CountryFieldMixin
from django.contrib.auth import get_user_model

User = get_user_model()

class AddressSerializer(CountryFieldMixin,serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    class Meta:
        model = Address
        fields = ['id','user','street_address','apartment_address','city','state','country','pincode','phone_no','delivery_type']
    
    def get_user(self,obj):
        user = User.objects.get(email=obj.user.email)
        return user.username