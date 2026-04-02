from rest_framework import serializers
from .models import Category, Medicine, ShopInventory

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class MedicineSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Medicine
        fields = (
            'id', 'name', 'category', 'category_name', 'manufacturer', 
            'description', 'price_per_unit', 'stock_quantity', 'expiry_date', 
            'unit', 'low_stock_threshold', 'created_at', 'updated_at', 'is_low_stock'
        )

class ShopInventorySerializer(serializers.ModelSerializer):
    medicine_details = MedicineSerializer(source='medicine', read_only=True)

    class Meta:
        model = ShopInventory
        fields = ('id', 'medicine', 'medicine_details', 'quantity', 'last_restocked')
