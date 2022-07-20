from django.shortcuts import render
import stripe
import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from cart.models import Cart
import json
from django.forms.models import model_to_dict
from accounts.models import UserAccount
from django.conf import settings
from .models import Payment
from django.shortcuts import get_object_or_404
from accounts.utils import SendMail
from orders.models import OrderItem,Order,Refund
from django.core.mail import send_mail
import random
import string
from address.models import Address
from fpdf import FPDF
from coupon.models import Coupon,PercentageCoupon
from delivery.models import Delivery
import datetime
# Create your views here.
stripe.api_key = settings.STRIPE_SECRET

dev_mail = "animish407@gmail.com"

def create_pdf_name():
    return ''.join([random.choice(string.ascii_letters
            + string.digits) for n in range(20)])

def create_pdf(order):
    def ln(x,val):
        x.ln(val)
    def color(x,r,g,b):
        x.set_text_color(r,g,b)
    def format_date(date):
        y = date[0:10].split("-")[::-1]
        return '-'.join(y)
    def determine_amount(price,qty):
        return price*qty
    address = order.delivery.address
    class PDF(FPDF):
        def print_title(self):
            self.set_font("Helvetica",size=36)
            self.cell(40,20,txt="Raven | INVOICE", align="L")
            color(self,128,128,128)
            ln(self,17)

            self.set_font_size(11.5)
            self.cell(100,10,txt="Invoice ID")
            self.cell(40,10,txt="Date of Order")
            ln(self, 7)

            color(self,1,1,1)
            self.cell(100,10,txt=f"{order.payment_intent}")
            self.cell(40,10,txt=f"{format_date(str(order.delivery.delivery_date))}")
            ln(self,20)

            color(self,128,128,128)
            self.cell(40,10,txt="Delivered To")
            ln(self,5)
            color(self,1,1,1)
            self.cell(40,10,txt=f"{address['street_address']}")
            ln(self,8)
            self.cell(40,10,txt=f"{address['apartment_address']} - {address['city']}")
            ln(self,10)
            self.cell(40,10,txt=f"{address['state']}, {address['country']} - {address['pincode']}")

            ln(self,30)
            color(self,128,128,128)
            self.cell(100,5,txt="Description")
            self.cell(35,5,txt="Unit Cost")
            self.cell(35,5,txt="Qty")
            self.cell(35,5,txt="Amount")

            for i in range(5):
                self.line(10, 115+(i*.225), 200, 115+(i*.225))
            color(self,1,1,1)
            ln(self,15)
            for item in order.items.all():
                x = item.product.price
                if item.product.discount_price: x = item.product.discount_price
                self.cell(100,5,txt=f"{item.product.name}")
                self.cell(35,5,txt=f"${x}")
                self.cell(35,5,txt=f"{item.quantity}")
                self.cell(35,5,txt=f"${determine_amount(x, item.quantity)}")
                ln(self,10)
            
            self.cell(170,5,txt="Delivery Charges")
            self.cell(35,5,txt=f"${order.delivery.delivery_charge}")
            ln(self,20)

            color(self,128,128,128)
            self.set_font_size(14)
            self.cell(50,20,txt="Invoice Total")
            ln(self,10)
            color(self,29, 161, 242)
            self.set_font_size(28)
            self.cell(50,20,txt=f"${order.total_price}")

    pdf = PDF()
    pdf.add_page()
    x = create_pdf_name()
    pdf.print_title()
    path = f"pdfs/{x}.pdf"
    pdf.output(f"/home/kali/Public/Programming/django-react/ecommerce/backend/media/{path}")
    return path

def create_refund_id():
    random_str = ''.join([random.choice(string.ascii_letters
            + string.digits) for n in range(32)])
    return random_str
def create_order_id():
    return ''.join([random.choice(string.digits) for n in range(20)])

def iterate_over_model(address):
    a = {}
    res = model_to_dict(address)
    for key, value in res.items():
        if key == "country" or key == "id" or key == "user":
            pass
        else:
            a[key]=value
    a["country"] = address.country.name
    return a

def create_delivery_id():
    return ''.join(random.choice(string.digits) for x in range(32))

def determine_delivery_price(d):
    if d == "Standard":
        return 2.00
    elif d == "Same Day":
        return 6.00
    elif d == "Overnight":
        return 10.00
    elif d == "Speed Post":
        return 30.00

class CreateIndent(APIView):
    def post(self, request,format=None):
        data = self.request.data
        cart = Cart.objects.get(user=self.request.user)
        user = UserAccount.objects.get(email=self.request.user.email)
        email = user.email
        address = Address.objects.get(user=request.user)
        delivery_charge = determine_delivery_price(address.delivery_type)
        amount = int(int(cart.get_total()) + delivery_charge) * 100
        
        intent = stripe.PaymentIntent.create(
            amount=amount,
            description="A Normal Transaction",
            automatic_payment_methods={"enabled": True},
            customer=user.stripe_id,
            currency="inr"
        )
        return Response({ "intentclientSecret" : intent["client_secret"]})

class SuccessPayment(APIView):
    def post(self, request,format=None):
        data = self.request.data
        payment_intent = data["payment_intent"]
        exist = stripe.PaymentIntent.retrieve(
            payment_intent
        )
        if exist.status == "succeeded":

            already_ordered = Order.objects.filter(user=self.request.user,payment_intent=payment_intent)
            if already_ordered.exists():
                order_exists = already_ordered[0]
                return Response({ "error" : "Order has been placed already","refund_id":order_exists.refund_id,"delivery_date":order_exists.delivery.delivery_date,"order":order_exists.id })

            user = UserAccount.objects.get(email=self.request.user.email)
            user_address = Address.objects.get(user=self.request.user)
            cart = Cart.objects.get(user=self.request.user)
            delivery_charge = determine_delivery_price(user_address.delivery_type)
            amount = int(int(cart.get_total()) + delivery_charge) * 100
            payment = Payment.objects.create(user=self.request.user,amount=amount,stripe_id=user.stripe_id)
            u = user_address

            delivery = Delivery.objects.create(
                user=self.request.user,
                delivery_id=create_delivery_id(),
                delivery_type=user_address.delivery_type,
                delivery_charge=float(delivery_charge),
                delivery_date= datetime.date.today(),
                address= iterate_over_model(u)
            )


            order = Order.objects.create(
                order_id = create_order_id(),
                user=self.request.user,
                address=user_address,
                refund_id = create_refund_id(),
                total_price=int(amount / 100),
                stripe_id=user.stripe_id,
                status="Order Received",
                payment_intent=payment_intent,
                delivery=delivery,
                coupon=cart.coupon,
            )
            for item in cart.items.all():
                    order_item = OrderItem.objects.create(user=request.user,product=item.product,quantity=item.quantity)
                    order.items.add(order_item)
                    order.save()
                    item.delete()
                    
            cart.delete()
            pdf = create_pdf(order)
            order.receipt = pdf
            order.save()
            stripe.PaymentIntent.modify(
                payment_intent,
                metadata={"refund_id":order.refund_id}
            )
            return Response({ "success" : "Payment Successfully Completed","refund_id":order.refund_id,"delivery_date":order.delivery.delivery_date,"order":order.id})
        

class RefundView(APIView):
    def post(self, request,format=None):
        data = self.request.data
        refund_id = data["refund_id"]
        reason = data["reason"]
        order = Order.objects.get(refund_id=refund_id,user=self.request.user)
        if (len(reason.strip()) > 0):
            refund = Refund.objects.create(user=request.user,
            refund_id=refund_id,
            email=self.request.user.email,
            order=order,
            reason=reason)
            order.status = 'Refund Asked'
            order.save()
            return Response({ "success" : "Refund Asked"})
        return Response({ "error": "Reason cannot be empty"})