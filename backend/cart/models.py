from django.db import models
from django.conf import settings
from product.models import Product
from address.models import Address
# Create your models here.

class CartItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.user} {self.product}"
    
    def get_total_price(self):
        return self.quantity * self.product.price

    def get_discount_price(self):
        return self.quantity * self.product.discount_price

    def get_difference(self):
        return self.get_total_price() - self.get_discount_price()
    
    def get_final(self):
        if self.product.discount_price:
            return self.get_discount_price()
        return self.get_total_price()

class Cart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    start_date = models.DateTimeField(auto_now_add=True)
    coupon = models.CharField(max_length=200, blank=True, null=True)
    items = models.ManyToManyField(CartItem)
    def get_total(self):
        total = 0
        for foo in self.items.all():
            total += foo.get_final()
        return total
    
    def __str__(self):
        return f"{self.user}"