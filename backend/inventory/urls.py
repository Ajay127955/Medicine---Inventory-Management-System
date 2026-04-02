from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, MedicineViewSet, ShopInventoryViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'medicines', MedicineViewSet)
router.register(r'shop-inventory', ShopInventoryViewSet, basename='shop-inventory')

urlpatterns = [
    path('', include(router.urls)),
]
