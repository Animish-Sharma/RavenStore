from .models import Order
from django.db.models.signals import post_save,pre_save
from django.dispatch import receiver
from PIL import Image
from io import BytesIO
from django.conf import settings
from accounts.utils import SendMail
import random
import string
from fpdf import FPDF
from accounts.models import *

def create_pdf_name():
    return ''.join([random.choice(string.ascii_letters
            + string.digits) for n in range(20)])

def create_pdf(order):
    def ln(x,val):
        x.ln(val)
    def color(x,r,g,b):
        x.set_text_color(r,g,b)

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
            self.cell(40,10,txt="18 June 2022")
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

@receiver(post_save,sender=Order)
def send_order_email(sender,instance,created,**kwargs):
    if created and instance:
        user = UserAccount.objects.get(email=instance.user.email)
        subject = "Order Details"
        message = f"Greetings MR/MRS/MS {user.first_name}, \n"\
                +"\n We received your order and we are processing it.\n"\
                +"\nIt will take some time to process.\n"\
                +"\nBe patient, your order will be delivered to you as soon as possible \n"\
                +"\nYou can go to your profile and track your order there\n"\
                +"\nAnimish Sharma"
        to= user.email
        pdf = create_pdf(instance)
        instance.receipt = pdf
        instance.save()
        SendMail.send_email_to_user(subject, message, to)
        
