from .models import Address
from django.db.models.signals import post_save,post_delete
from django.contrib.auth.models import User
from django.dispatch import receiver
from accounts.models import UserAccount

@receiver(post_save,sender=Address)
def user_address_create(sender,instance,created,**kwargs):
    if created and instance:
        user = UserAccount.objects.get(email=instance.user.email)
        user.address = instance
        user.save()
        pass
        
