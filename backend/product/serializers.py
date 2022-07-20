from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = ['id','name','category','price','discount_price','image','image_1','image_2','image_3','image_4','slug','description','banner_img']
    
    def get_category(self, obj):
        return obj.get_category_display()