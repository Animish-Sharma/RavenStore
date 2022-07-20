from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import permissions
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from .serializers import AddressSerializer
from .models import Address
# Create your views here.

class UserAddress(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self,request,format=None):
        try:
            add = Address.objects.get(user=self.request.user)
            ser_add = AddressSerializer(add).data
            return Response({ "success": ser_add })
        except ObjectDoesNotExist:
            return Response({ "message":"Address Doesn't Exist" })
        except Exception as e:
            print(e)
            return Response({"error":e})

class AddressUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self,request,format=None):
        data = self.request.data
        street_address = data['street_address']
        apartment_address = data['apartment_address']
        city = data['city']
        state = data['state']
        country = data['country']
        pincode = data['pincode']
        phone_no = data['phone']

        add = Address.objects.filter(user=self.request.user)
        if(add.exists()):
            user_add = add[0]
            user_add.street_address = street_address
            user_add.apartment_address = apartment_address
            user_add.city = city
            user_add.state = state
            user_add.country=  country
            user_add.pincode = pincode
            
            user_add.phone_no =  phone_no
            user_add.save()
            return Response({ "success":"Address Successfully Updated" })

        return Response({ "error":"Address Doesn't Exist" })
        

class CreateAddressView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self,request,format=None):
        data= self.request.data
        street_address = data['street_address']
        apartment_address = data['apartment_address']
        city = data['city']
        state = data['state']
        country = data['country']
        pincode = data['pincode']
        phone_no = data['phone']

        
        user_add = Address.objects.filter(user=self.request.user)
        if(user_add.exists()):
            return Response({ "error":"Address already exists" })

        address = Address.objects.create(user=self.request.user)
        try:
            for user_data in data:
                if(len(data[user_data].strip(" ")) <= 0):
                    address.delete()
                    return Response({ "error":"Fields are empty" })
                else:
            
                    address.street_address = street_address
                    address.apartment_address = apartment_address
                    address.city = city
                    address.state = state
                    address.country=  country
                    address.delivery_type = "Standard"
                    address.pincode = pincode
                    address.phone_no =  phone_no
                    address.save()

                    return Response({ "success":"Hello World" })
                
        except Exception as e:
            address.delete()
            print(e)
            return Response({ "error":"An error occurred", "er":e })

class ChangeDeliveryType(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self,request,format=None):
        data = self.request.data
        delivery = data['delivery']
        add = Address.objects.filter(user=self.request.user)
        if(add.exists()):
            user_add = add[0]
            user_add.delivery_type = str(delivery)
            user_add.save()
        
        return Response({ "error":"Address Doesn't Exist" })
        
class DeleteAddress(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def delete(self,request,format=None):
        try:
            user_add = Address.objects.get(user=self.request.user)
            user_add.delete()
            return Response({ "success":"Deleted Address Successfully" })
        except Exception as e:
            print(e)
            return Response({ "success":e })