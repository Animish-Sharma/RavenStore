from django.db import models
from django_countries.fields import CountryField
from django.conf import settings
# Create your models here.

class Address(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    street_address = models.CharField(max_length=400)
    apartment_address = models.CharField(max_length=400)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    country = CountryField()
    pincode = models.CharField(max_length=100)
    phone_no = models.CharField(max_length=20)
    delivery_type = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.user} {self.pincode}"
