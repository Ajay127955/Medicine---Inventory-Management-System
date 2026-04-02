from rest_framework import serializers
from .models import Order, OrderItem
from inventory.models import Medicine
from inventory.serializers import MedicineSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    medicine_name = serializers.ReadOnlyField(source='medicine.name')
    medicine_details = MedicineSerializer(source='medicine', read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'medicine', 'medicine_name', 'medicine_details', 'quantity', 'unit_price', 'total_price')
        read_only_fields = ('unit_price',)

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Order
        fields = ('id', 'user', 'username', 'status', 'total_amount', 'notes', 'items', 'created_at', 'updated_at')
        read_only_fields = ('user', 'total_amount', 'status')

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        order.calculate_total()
        return order
