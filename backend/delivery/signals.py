
from .models import *
import requests
from django.db.models.signals import *
from django.dispatch import receiver

@receiver(post_save,sender=Delivery)
def set_long_and_lat(sender,instance,created,**kwargs):
    if created:
        address = instance.address['city']
        print("created")
        address = address.replace(" ","%20")
        res = requests.get(f"http://api.positionstack.com/v1/forward?access_key=api_key&query={address}")
        x = res.json()
        if (x["data"][0]["latitude"]):
            instance.lat = x["data"][0]['latitude'] 
            instance.long = x["data"][0]["longitude"]
        instance.save()
        