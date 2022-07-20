from django.db import models
from django.conf import settings
from product.models import Product
# Create your models here.
class FavoriteItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} | {self.product.name}"

class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    add_date = models.DateTimeField(auto_now_add=True)
    items = models.ManyToManyField(FavoriteItem)

    def __str__(self):
        return self.user.username