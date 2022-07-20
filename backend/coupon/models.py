from django.db import models

# Create your models here.
class Coupon(models.Model):
    code = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=5,decimal_places=2)

    def __str__(self):
        return self.code

class PercentageCoupon(models.Model):
    code = models.CharField(max_length=50)
    percentage_off = models.IntegerField()

    def __str__(self):
        return self.code