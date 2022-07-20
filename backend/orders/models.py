from django.db import models
from address.models import Address
from django.conf import settings
from product.models import Product
from delivery.models import Delivery
# Create your models here.


class OrderItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.user.username} {self.product}"

class Order(models.Model):
    ORDER_STATUS = (
        ('Order Received','Order Received'),
        ('Processed','Processed'),
        ('Shipped','Shipped'),
        ('Out for Delivery','Out for Delivery'),
        ('Delivered','Delivered'),
        ('Cancelled','Cancelled'),
        ('Refund Asked','Refund Asked'),
        ('Refunded','Refunded')
    )

    DELIVERY_TYPE = (
        ('Standard','Standard'),
        ("Same Day","Same Day"),
        ("Overnight","Overnight"),
        ("Speed Post","Speed Post"),
    )
    order_id = models.CharField(max_length=20,null=True,blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    status = models.CharField(max_length=40,choices=ORDER_STATUS)
    stripe_id = models.CharField(max_length=30)
    address = models.ForeignKey(Address, on_delete=models.DO_NOTHING)
    delivery = models.ForeignKey(Delivery, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=8,decimal_places=2)
    payment_intent = models.CharField(max_length=75)
    ordered_date = models.DateTimeField(auto_now_add=True)
    coupon = models.CharField(max_length=50, blank=True,null=True)
    items = models.ManyToManyField(OrderItem)
    refund_id = models.CharField(max_length=32,unique=True)
    receipt = models.FileField(upload_to=f"pdfs/", null=True,blank=True)
    def __str__(self):
        return self.stripe_id
    
class Refund(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    refund_id = models.CharField(max_length=32)
    order = models.ForeignKey(Order,on_delete=models.CASCADE)
    reason = models.TextField()
    email= models.EmailField()

    def __str__(self):
        return self.refund_id