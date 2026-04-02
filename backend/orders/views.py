from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer
from accounts.permissions import IsAdmin, IsShopOwner

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Order.objects.all()
        return Order.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

    def update(self, request, *args, **kwargs):
        # Allow admin to update status only
        if request.user.role != 'admin':
            return Response({"error": "Only admins can update order status"}, status=status.HTTP_403_FORBIDDEN)
        
        instance = self.get_object()
        new_status = request.data.get('status')
        if new_status:
            instance.status = new_status
            instance.save()
            return Response(self.get_serializer(instance).data)
        
        return super().update(request, *args, **kwargs)
