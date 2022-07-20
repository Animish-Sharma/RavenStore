from django.db.models.signals import post_save,pre_delete
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import Like


@receiver(post_save,sender=Like)
def post_save_likes(sender,instance,created,**kwargs):
    if created:
            for foo in Like.objects.filter(review=instance.review):
                value = 0
                value += foo.value
                instance.review.likes = value
                instance.review.save()
                instance.save()

@receiver(pre_delete,sender=Like)
def remove_like(sender,instance,using,**kwargs):
    instance.review.likes -= instance.value
    instance.review.save()
    instance.save()