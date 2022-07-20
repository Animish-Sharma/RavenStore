from django.shortcuts import render
from rest_framework.generics import ListAPIView,RetrieveAPIView
from rest_framework import permissions
from rest_framework.views import APIView
from django.db.models import Q
from .serializers import ProductSerializer
from .models import Product
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from fpdf import FPDF
import random
from orders.models import Order
import string
# Create your views here.



class PaginationClass(PageNumberPagination):
    page_size = 1000
    page_size_query_param = 'page_size'
    max_page_size = 10000

class ProductList(ListAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ProductSerializer
    def get_queryset(self):
        product = Product.objects.all()
        return product

class ProductDetail(RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ProductSerializer
    def get_queryset(self):
        product = Product.objects.all()
        return product
    lookup_field = 'slug'

class CategoryView(APIView,PageNumberPagination):
    permission_classes = (permissions.AllowAny,)
    pagination_class = PaginationClass
    def post(self,request,format=None):
        category = self.request.data['category']

        products = Product.objects.order_by("-id").filter(category=category)

        if not products.exists():
            return Response({ "error":"No products found with this category" })

        paginator = PageNumberPagination()
        paginator.page_size = 10
        result = paginator.paginate_queryset(products, request)

        serializer = ProductSerializer(result,many=True)
        return paginator.get_paginated_response(serializer.data)

class ProductSearchView(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request,format=None):
        data = self.request.data
        field = data['field']

        if not field.isnumeric() :
            search_product = Product.objects.filter(Q(name__icontains=field) | Q(category=field) |  Q(description__icontains=field))
        else:
            field = int(field)
            search_product = Product.objects.filter(Q(price__lte=field) | Q(discount_price__lte=field))
        if not search_product.exists():
            return Response({ "error":"Product does not exist" })

        paginator = PageNumberPagination()
        paginator.page_size = 6
        result = paginator.paginate_queryset(search_product, request)
        serializer = ProductSerializer(result,many=True)
        return paginator.get_paginated_response(serializer.data)

class FeaturedProduct(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self,request,format=None):
        products = Product.objects.filter(featured=True)
        serialized = ProductSerializer(products,many=True).data
        return Response({ "data": serialized })

