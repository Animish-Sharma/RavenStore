from rest_framework.views import APIView
from rest_framework import permissions
from .models import PasswordReset
from rest_framework.response import Response
from accounts.models import UserAccount
from django.utils import timezone
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings
from accounts.utils import SendMail
import random
import datetime
import string
import pytz

User = get_user_model()
dev_email = "animish407@gmail.com"

def generate_code():
    return ''.join(random.choice(string.digits) for x in range(6))

class PasswordResetView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request,format=None):
        data = self.request.data
        email = data['email']

        user = User.objects.filter(email=email)
        if not user.exists():
            return Response({ "error":"User does not exist" })
        user=user[0]
        exist = PasswordReset.objects.filter(email=email)
        if exist.exists():
            for foo in exist:
                foo.delete()
        code = generate_code()
        reset = PasswordReset.objects.create(email=email,user=user,code=code,expire_time=(timezone.now() + datetime.timedelta(minutes=5)))

        subject = "Password Reset Request"
        message = f"Greetings {user.first_name}\n" + \
        "\nWe got a password reset request on your email\n" + \
        f"\nYour code is {str(code)}\n" + \
        "This code will expire in 5 minutes\n\n" + \
        "\nIf you don't requested to reset your password, then don't share this code with anyone\n" + \
        "\nVisit http://localhost:3000/auth/reset to reset your password\n" + \
        f"\nFor additional help, you can contact devloper on {dev_email}\n" + \
        f"\n\nAnimish Sharma"
        sender = settings.EMAIL_HOST_USER
        to = [email,]

        send_mail(subject=subject, message=message,from_email=sender,recipient_list=to)
        return Response({ "success":"Email sent successfully" })

class AuthPasswordReset(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self,request,format=None):
        data = self.request.data
        user = User.objects.get(username=self.request.user.username)

        now = timezone.now()

        current_time = now.strftime("%H:%M:%S")
        user_account = UserAccount.objects.get(username=self.request.user.username)
        if user.check_password(data["old_password"]):
            if data["password"]:
                    if data["password"] != "" and len(data["password"].strip(" ")) != 0:
                        user.set_password(data["password"])
                        user.save()
                        user_account.password = user.password
                        user_account.save()

                        message = f"Greetings {user.first_name}\n" + \
                        f"\nYour Password was reset on {current_time} UTC\n" + \
                        f"\nThis request was dated {datetime.date.today()}\n" + \
                        "If the request wasn't from you. Please contact the dev immediately\n\n" + \
                        f"\nContact dev on {dev_email}\n" + \
                        "\nVisit http://localhost:3000/auth/reset to reset your password\n" + \
                        f"\nIf you did reset your password then ignore this email\n" + \
                        f"\nFor additional help, you can contact devloper on {dev_email}\n" + \
                        f"\n\nAnimish Sharma"
                        SendMail.send_email_to_user("Password Reset", message, user.email)
                        return Response({ "success" : "Hello World"})

            return Response({ "error" : "Password do not match"})
        return Response({ "error": "An error occurred" })

class PasswordResetCodeSubmit(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self,request,format=None):
        data = self.request.data
        code = data['code']
        email = data['email']
        password = data['password']
        re_password = data['re_password']

        try:
            user_code = PasswordReset.objects.get(code=int(code),email=email)
        except ObjectDoesNotExist:
            return Response({ "error":"Link doesn't exist"})
        email = user_code.user.email

        if(user_code.expire_time <= timezone.now()):
            user_code.delete()
            return Response({ "error":"Link expired"})

        user_acc = UserAccount.objects.get(email=email)
        user = User.objects.get(email=email)

        
        
        if password == re_password:
            if len(password) < 6:
                return Response({ "error":"Password must be atleast 6 characters long"})
            else:
                user.set_password(password)
                user_acc.password = user.password
                user.save()
                user_acc.save()

                subject = "Password Changed Successfully"
                message = f"Greetings {user.first_name}\n" + \
                "\nWe have successfully changed your password\n" + \
                f"\nI hope that our email service was fast\n" + \
                "\nIf you don't requested to reset your password, and it still changed\n" + \
                f"Contact devloper on {dev_email} immediately"
                sender = settings.EMAIL_HOST_USER
                to = [email,]

                send_mail(subject=subject, message=message,from_email=sender,recipient_list=to)

                user_code.delete()

                return Response({ "success":"Password changed Successfully" })
        else:
            return Response({ "error":"Passwords do not match"})