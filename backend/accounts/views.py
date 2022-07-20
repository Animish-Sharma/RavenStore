from .serializers import UserAccountSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import UserAccount
import stripe
from user.models import PasswordReset
from payment.models import Payment
from rest_framework import permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from cart.models import *
from django.conf import settings
from orders.models import *
from reviews.models import Reviews,Like
from django.core.mail import send_mail
from .utils import SendMail
# Create your views here.

stripe.api_key = settings.STRIPE_SECRET
User = get_user_model()
class SignUpView(APIView):
    permission_classes = (permissions.AllowAny, )
    def post(self,request, format=None):
        data = self.request.data
        first_name = data['first_name']
        last_name = data['last_name']
        username = data['username']
        email = data['email']
        password = data['password']
        if User.objects.filter(email=email).exists():
            return Response({ "error":"User Already Exists" })
        else:
            if len(password) < 6:
                return Response({ "error":"Password Must be of at least 6 characters"})
            else:
                if User.objects.filter(username=username).exists():
                    return Response({ "error":"UserName already exists.Choose a different one" })
                else:
                    customer = stripe.Customer.create(
                        name= f"{first_name} {last_name}",
                        email=email,
                    )
                    user = UserAccount.objects.create(first_name=first_name,
                    last_name=last_name,
                    email=email,
                    password=password,
                    stripe_id=customer.id,
                    username=username
                    )
                    user.save()
                    del user.password
                    

                    serializer = UserAccountSerializer(user,many=False)
                    subject="Register Successful"
                    message = f"Thank You for registering yourself to our e-commerce website Mr. {first_name} {last_name}.\n \n" + \
                    "We are thankful to you for this decision. This is still a test website. So please don't try to order anything \n\n" + \
                    "Your's sincerely\n\nAnimish Sharma"
                    SendMail.send_email_to_user(subject, message, email)
                    return Response({"user":serializer.data,"success":"Successfully Created your account"})



class LoginSerializer(TokenObtainPairSerializer):
    def validate(self,attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        # custom data for frontend
        user = UserAccount.objects.get(username = attrs["username"])
        serialized_user = UserAccountSerializer(user,many=False)
        data["user"] = serialized_user.data


        return data

class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer

class UpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request,format=None):
        data=self.request.data
        user = User.objects.get(username=self.request.user.username)
        user_account = UserAccount.objects.get(username=self.request.user.username)
        if user.check_password(data["password"]):

            if data["first_name"]:
                if data["first_name"] != "" and len(data["first_name"].strip(" ")) != 0:
                    user_account.first_name = data["first_name"]
                    user_account.save()
                    user.first_name = user_account.first_name
                    user.save()
            
            if data["last_name"]:
                if data["last_name"] != "" and len(data["last_name"].strip(" ")) != 0:
                    user_account.last_name = data["last_name"]
                    user_account.save()
                    user.last_name = user_account.last_name
                    user.save()

            if data["email"]:
                if data["email"] != "" and len(data["email"].strip(" ")) != 0:
                    user_account.email = data["email"]
                    user_account.save()
                    user.email = user_account.email
                    user.save()

            if data["username"]:
                if data["username"] != "" and len(data["username"].strip(" ")) != 0:
                    user_account.username = data["username"]
                    user_account.save()
                    user.username = user_account.username
                    user.save()

            if data["new_password"]:
                if data["new_password"] != "" and len(data["new_password"].strip(" ")) != 0:
                    user.set_password(data["new_password"])
                    user.save()
                    user_account.password = user.password
                    user.save()
        else:
            return Response({"error":"Incorrect Password"})
        
        serialized_user = UserAccountSerializer(user_account,many=False)
        return Response({"success":"Successfully Updated user","user":serialized_user.data})

class DeleteAccount(APIView):
    def post(self,request,format=None):
        data = self.request.data
        user = User.objects.get(username=self.request.user.username)
        user_account = UserAccount.objects.get(username=self.request.user.username)
        if(user.check_password(data["password"])):
            orders = Order.objects.filter(user=self.request.user)
            for order in orders:
                for item in order.items.all():
                    item.delete()
                order.delete()
            refunds = Refund.objects.filter(user=self.request.user)
            for refund in refunds:
                refund.delete()
            carts = Cart.objects.filter(user=self.request.user)
            if len(carts) > 0:
                cart=carts[0]
                for item in cart.items.all():
                    item.delete()
                cart.delete()
            payments = Payment.objects.filter(user=self.request.user)
            for payment in payments:
                payment.delete()
            resets = PasswordReset.objects.filter(user=self.request.user)
            for reset in resets: reset.delete()
            reviews = Reviews.objects.filter(user=self.request.user)
            for review in reviews: review.delete()
            likes = Like.objects.filter(user=self.request.user)
            for like in likes: like.delete()
            stripe.Customer.delete(str(user_account.stripe_id))
            user_account.delete()
            return Response({ "success": "Account Delete Successfully"})
        return Response({ "error": "Incorrect Password"})