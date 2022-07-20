from django.shortcuts import render
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework import permissions
from rest_framework.response import Response
from .serializers import OrderSerializer
from .models import Order
# Create your views here.

class OrderList(APIView):
    def get(self,request,format=None):
        order = Order.objects.filter(user=self.request.user).order_by('-id')
        data = OrderSerializer(order,many=True).data
        return Response({"orders": data })

class OrderDetail(RetrieveAPIView):
    serializer_class = OrderSerializer
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    lookup_field= "pk"

