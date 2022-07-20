from django.test import TestCase

# Create your tests here.

class Delivery(models.Model):
    DELIVERY_TYPE = (
        ('Standard','Standard'),
        ("Same Day","Same Day"),
        ("Overnight","Overnight"),
        ("Speed Post","Speed Post"),
    )
    delivery_id = models.CharField(max_length=32)
    delivery_type = models.CharField(max_length=50,choices=delivery_type)
    delivery_date = models.DateTimeField()
    delivery_charge = models.IntegerField()