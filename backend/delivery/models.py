from django.db import models
from django.conf import settings
from django.db.models import JSONField

# Create your models here.
class Delivery(models.Model):
    DELIVERY_TYPE = (
        ('Standard','Standard'),
        ("Same Day","Same Day"),
        ("Overnight","Overnight"),
        ("Speed Post","Speed Post"),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    delivery_id = models.CharField(max_length=32)
    delivery_type = models.CharField(max_length=50,choices=DELIVERY_TYPE)
    delivery_date = models.DateTimeField()
    delivery_charge = models.FloatField()
    address = JSONField(null=True,blank=True)
    lat = models.CharField(max_length=255,null=True,blank=True)
    long = models.CharField(max_length=255,null=True,blank=True)

    def __str__(self):
        return self.delivery_id
    