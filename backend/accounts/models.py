from django.db import models
from address.models import Address
# Create your models here.
class UserAccount(models.Model):
    first_name = models.CharField(max_length=300)
    last_name = models.CharField(max_length=300)
    username = models.CharField(max_length=400)
    email = models.EmailField(max_length= 200,unique=True)
    password = models.CharField(max_length=1000)
    address = models.OneToOneField(Address,on_delete=models.SET_NULL,null=True)
    stripe_id = models.CharField(max_length=50,blank=True,null=True)

    def __str__(self):
        return self.username