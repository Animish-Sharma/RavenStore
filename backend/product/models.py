from django.db import models
from tinymce.models import HTMLField
from django.template.defaultfilters import slugify
# Create your models here.

class Product(models.Model):

    class Categories(models.TextChoices): 
        TECHNOLOGY = 'tech'
        BOOKS='books'
        APPAREL='apparel'
        HOME_KITCHEN = 'h&k'
        BEAUTY='beauty'
        TOYS_GAMES='t&g',
        HOME_ENTERTAINMENT="home"
        LUGGAGE='luggage'
    

    name = models.CharField(max_length=200)
    category = models.CharField(choices=Categories.choices,max_length=30)
    price = models.DecimalField(decimal_places=2,max_digits=8)
    discount_price = models.DecimalField(blank=True,null=True,decimal_places=2,max_digits=8)
    image = models.ImageField(upload_to="products")
    image_1 = models.ImageField(upload_to="products",blank=True,null=True,help_text="if any")
    image_2 = models.ImageField(upload_to="products",blank=True,null=True,help_text="if any")
    image_3 = models.ImageField(upload_to="products",blank=True,null=True,help_text="if any")
    image_4 = models.ImageField(upload_to="products",blank=True,null=True,help_text="if any")
    banner_img = models.ImageField(upload_to="banners",blank=True,null=True)
    slug = models.SlugField(max_length=400,blank=True,null=True)
    description = HTMLField()
    featured = models.BooleanField(default=False)


    def save(self,*args, **kwargs):
        copy_slug = slugify(self.name)
        queryset = Product.objects.filter(slug__iexact=copy_slug).count()
        count = 1
        slug = copy_slug

        while(queryset):
            query = Product.objects.get(slug__iexact= slug)
            if(query.id == self.id):
                break
            slug = copy_slug + "-" + str(count)
            count += 1
            queryset = Product.objects.get(slug__iexact=slug).count()

        self.slug = slug
        if self.featured:
            try:
                length = Product.objects.filter(featured=True).count()
                if length >= 5:
                    temp = Product.objects.filter(featured=True)[length - 1]
                    temp.featured = False
                    temp.save()
            except Product.DoesNotExist:
                pass
        super(Product,self).save(*args,**kwargs)

    def __str__(self):
        return f"{self.name}"
