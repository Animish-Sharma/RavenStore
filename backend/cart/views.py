from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import CartSerializer
from rest_framework import permissions
from .models import CartItem,Cart
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from product.models import Product
from coupon.models import *
from django.core.exceptions import ObjectDoesNotExist
# Create your views here.


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request,format=None):
        list_products = [total for total in Cart.objects.filter(user=request.user)]
        serializer = CartSerializer(list_products,many=True)
        if(len(serializer.data) != 0):
            return Response(serializer.data[0])
        return Response({"error":"No items in cart"})
class CountCart(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request,format=None):
        try:
            cart = Cart.objects.get(user=request.user)
            cart_count = cart.items.all().count()
            return Response({"count": cart_count})
        except ObjectDoesNotExist:
            return Response({"count": 0})
        except Exception as e:
            return Response({"error":e})


class AddToCart(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request,format=None):
        data= self.request.data
        slug = data['slug']
        product = get_object_or_404(Product,slug=slug)

        cart_item_no = CartItem.objects.filter(product=product,user=self.request.user)
        if cart_item_no.exists():
            cart_item = cart_item_no.first()
            cart_item.quantity += 1
            cart_item.save()

        else:
            cart_item = CartItem.objects.create(product=product,user=self.request.user)
            cart_item.save()
        
        cart_no = Cart.objects.filter(user=self.request.user)
        if cart_no.exists():
            cart = cart_no[0]
            if not cart.items.filter(product__id = cart_item.product.id).exists():
                cart.items.add(cart_item)
        else:
            cart = Cart.objects.create(user=self.request.user)
            cart.items.add(cart_item)
            cart.save()
        return Response({ "success":"Item added to cart" })


class RemoveFromCart(APIView):
    def post(self,request,format=None):
        slug = self.request.data['slug']
        if slug is None:
            return Response({ "error":"Data was not provided" })
        product = get_object_or_404(Product,slug=slug)
        cart_no = Cart.objects.filter(user=request.user)
        if cart_no.exists():
            cart = cart_no[0]
            if cart.items.filter(product__slug=product.slug).exists():
                cart_item = CartItem.objects.filter(user=request.user,product=product)[0]
                if cart_item.quantity > 1:
                    cart_item.quantity -= 1
                    cart_item.save()
                    
                else:
                    cart.items.remove(cart_item)
                    cart_item.delete()

                    if cart.items.count() <= 0:
                        cart.delete()
                return Response({ "success":"Item Removed from Cart" })
            else:
                return Response({ "error":"This item was not in your cart" })

        else:
            return Response({ "error":"You don't have an active cart" })

class CouponApply(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request,format=None):
        data = self.request.data
        cpn_amount = 0
        cart = Cart.objects.get(user=self.request.user)
        coupon = data["coupon"]
        s_cpn = Coupon.objects.filter(code=coupon)
        if not s_cpn.exists():
            sp_cpn = PercentageCoupon.objects.filter(code=coupon)
            if not sp_cpn.exists():
                return Response({ "error" : "Coupon does not exist"})
            p_cpn = sp_cpn[0]
            cart.coupon = p_cpn.code
            cart.save()
        else:
            cpn = s_cpn[0]
            cart.coupon = cpn.code
            cart.save()
        return Response({ "success" : "Coupon applied"})
            
class CouponRemove(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request,format=None):
        cart = Cart.objects.get(user=self.request.user)
        cart.coupon = ""
        cart.save()
        return Response({ "success" : "Coupon Removed" })


class CartDelete(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def delete(self, request,format=None):
        cart = Cart.objects.get(user=self.request.user)
        for item in cart.items.all():
            item.delete()
        cart.delete()
        return Response({ "success" : "Cart Deleted Successfully" })



class BuyNowView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request,format=None):
        data = self.request.data
        slug = data['slug']
        product = Product.objects.get(slug=slug)
        carts = Cart.objects.filter(user=self.request.user)
        if(carts.exists()):
            cart = carts[0]
            for item in cart.items.all():
                item.delete()
        else:
            cart = Cart.objects.create(user=self.request.user)
        cart_item = CartItem.objects.create(product=product,user=self.request.user)
        cart_item.save()
        cart.items.add(cart_item)
        cart.save()
        return Response({ "success":"Buy Now Avail" })


class CartItemDelete(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request,format=None):
        cart = Cart.objects.get(user=self.request.user)
        data = self.request.data
        slug = data['slug']
        for item in cart.items.all():
            if item.product.slug == slug:
                item.delete()
                if cart.items.count() <= 0:
                        cart.delete()
                return Response({ "success" : "Item Deleted"})
        return Response({ "error": "Item does not exist in your cart" })
