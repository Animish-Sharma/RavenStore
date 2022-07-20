from django.contrib.auth import get_user_model
from .models import Reviews,Like
from rest_framework import serializers
from product.serializers import ProductSerializer
User = get_user_model()

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    
    class Meta:
        model = Reviews
        fields = ('id','user','title','description','rating','likes',)

    def get_user(self,obj):
        user = User.objects.filter(email=obj.user.email)
        if user:
            user = user[0]
        return f"{user}"

class LikeSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    review = serializers.SerializerMethodField()
    class Meta:
        model = Like
        fields = ('id','user','review','value','choice')
    
    def get_user(self,obj):
        user = User.objects.get(email=obj.user.email)
        return f"{user}"

    def get_review(self,obj):
        review_ = Reviews.objects.get(id=obj.review.id)
        return ReviewSerializer(review_).data