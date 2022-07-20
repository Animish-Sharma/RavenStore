from django.db import models
from django.conf import settings
# Create your models here.

class Payment(models.Model):
    stripe_id = models.CharField(max_length=50)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    amount = models.FloatField()
    time_created = models.DateTimeField(auto_now_add=True)