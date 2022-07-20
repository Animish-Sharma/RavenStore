from .models import PasswordReset,AccountConfirm
from rest_framework import serializers

from django.contrib.auth import get_user_model
User = get_user_model()

class PasswordResetSerialziers(models.Model):
    user= serializers.SerializerMethodField()
    class Meta:
        model = PasswordReset
        fields = ['id','user','email','code']
    def get_user(self,obj):
        user = User.objects.get(email=obj.user.email)
        return f"{user.first_name} {user.last_name}"

class AccountConfirmSerializer(models.Model):
    user= serializers.SerializerMethodField()
    class Meta:
        model = AccountConfirm
        fields = ['id','user','email','code']
    def get_user(self,obj):
        user = User.objects.get(email=obj.user.email)
        return f"{user.first_name} {user.last_name}"