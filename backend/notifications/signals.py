from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from django.contrib.auth import get_user_model
from orders.models import Order
from inventory.models import Medicine
from .models import Notification



@receiver(post_save, sender=Order)
def order_notification(sender, instance, created, **kwargs):
    if created:
        User = get_user_model()
        # Notify all admins when a new order is placed
        admin_users = User.objects.filter(role='admin')
        for admin in admin_users:
            Notification.objects.create(
                recipient=admin,
                title="New Order Received",
                message=f"Shop owner {instance.user.username} placed a new order #{instance.id}.",
                notification_type='new_order',
                related_order=instance
            )
    else:
        # Notify the shop owner when the order status changes
        Notification.objects.create(
            recipient=instance.user,
            title="Order Status Updated",
            message=f"Your order #{instance.id} has been updated to '{instance.status}'.",
            notification_type='order_status',
            related_order=instance
        )

@receiver(post_save, sender=Medicine)
def low_stock_notification(sender, instance, **kwargs):
        if instance.is_low_stock:
            User = get_user_model()
            # Notify admin
            admin_users = User.objects.filter(role='admin')
            for admin in admin_users:
                Notification.objects.create(
                    recipient=admin,
                    title="Low Stock Alert",
                    message=f"Medicine '{instance.name}' is low on stock ({instance.stock_quantity}/{instance.low_stock_threshold}).",
                    notification_type='low_stock'
                )

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def welcome_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            recipient=instance,
            title="Welcome!",
            message=f"Welcome to the Medicine Inventory System, {instance.username}. Your role is {instance.role}.",
            notification_type='new_user'
        )
