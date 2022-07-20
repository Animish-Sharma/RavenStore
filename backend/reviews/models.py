from django.db import models
from product.models import Product
from django.conf import settings
# Create your models here.

class Reviews(models.Model):

    RATING_CHOICES = (
        ('1','1'),
        ('2','2'),
        ('3','3'),
        ('4','4'),
        ('5','5')
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    title = models.CharField(max_length = 255)
    description = models.TextField()
    rating = models.CharField(max_length = 2,choices=RATING_CHOICES)
    likes = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.title} to {self.product.name}"

    class Meta:
        verbose_name = "Review"
        verbose_name_plural = "Reviews"
        ordering = ['-id']

class Like(models.Model):

    class ChoiceField(models.TextChoices):
        DISLIKE = 'dislike'
        LIKE = 'like'

    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    review = models.ForeignKey(Reviews,on_delete=models.CASCADE)
    value = models.IntegerField(default=1)
    choice = models.CharField(max_length=20,choices=ChoiceField.choices,default=ChoiceField.LIKE)
    def __str__(self):
        return f"{self.user} {self.review}"