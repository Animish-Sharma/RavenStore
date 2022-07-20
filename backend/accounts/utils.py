from django.conf import settings
from django.core.mail import EmailMessage

class SendMail:
    def send_email_to_user(subject, message,email, file=""):
        sender = settings.EMAIL_HOST_USER
        to = [email,]
        mail = EmailMessage(subject=subject, body=message, from_email=sender, to=to)
        if file != "": mail.attach('receipt.pdf', file, "application/pdf")
        mail.send()
        print("Mail Sent")
        return 0