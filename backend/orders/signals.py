from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order
from inventory.models import ShopInventory, Medicine
from notifications.models import Notification

@receiver(post_save, sender=Order)
def handle_order_status_change(sender, instance, created, **kwargs):
    # Only trigger when the order is marked as 'delivered'
    if instance.status == 'delivered':
        print(f"Triggering stock transfer for Order #{instance.id}...")
        
        # 1. Gather tablet names for notification
        tablet_names = [item.medicine.name for item in instance.items.all()]
        tablets_text = ", ".join(tablet_names)

        # 2. Perform Stock Transfer
        for item in instance.items.all():
            # Decrease Admin (Central) Stock
            med = item.medicine
            if med.stock_quantity >= item.quantity:
                med.stock_quantity -= item.quantity
                med.save()
            
            # Increase Shop Owner (Local) Stock
            shop_med, _ = ShopInventory.objects.get_or_create(
                user=instance.user,
                medicine=item.medicine
            )
            shop_med.quantity += item.quantity
            shop_med.save()

        # 3. Create Detailed Notification for User
        Notification.objects.create(
            recipient=instance.user,
            title="Supplies Delivered",
            message=f"Your order containing {tablets_text} has been delivered and added to your personal inventory.",
            notification_type='order_status'
        )
    
    # Simple notification for other status changes
    elif not created and instance.status in ['approved', 'shipped', 'rejected']:
        Notification.objects.create(
            recipient=instance.user,
            title="Order Update",
            message=f"Order #{instance.id} status changed to {instance.status}.",
            notification_type='order_status'
        )
