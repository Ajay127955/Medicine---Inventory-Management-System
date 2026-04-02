from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Medicine, ShopInventory
from .serializers import CategorySerializer, MedicineSerializer, ShopInventorySerializer
from accounts.permissions import IsAdmin

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'manufacturer', 'description']
    ordering_fields = ['price_per_unit', 'stock_quantity', 'expiry_date', 'created_at']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

class ShopInventoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ShopInventorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ShopInventory.objects.filter(user=self.request.user)
