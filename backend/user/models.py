from django.db import models
from django.conf import settings
import datetime
import pytz
# Create your models here.

class PasswordReset(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    email = models.EmailField()
    code = models.CharField(max_length=6)
    requested_time = models.DateTimeField(auto_now_add=True)
    expire_time = models.DateTimeField()

    def __str__(self):
        return self.user.username

    @property
    def delete_after_expiration(self):
        if(self.expire_time <= datetime.datetime.now().replace(tzinfo=pytz.UTC)):
            e = PasswordReset.objects.get(pk=self.pk)
            e.delete()