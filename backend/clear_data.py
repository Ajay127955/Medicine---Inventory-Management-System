import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from inventory.models import Category, Medicine
from orders.models import Order, OrderItem
from notifications.models import Notification

def clear_dummy_data():
    print("Cleanup initiated...")
    
    # 1. Clear Orders & OrderItems
    order_count = Order.objects.count()
    Order.objects.all().delete()
    print(f"- Deleted {order_count} Orders.")

    # 2. Clear Medicines
    medicine_count = Medicine.objects.count()
    Medicine.objects.all().delete()
    print(f"- Deleted {medicine_count} Medicines.")

    # 3. Clear Categories
    category_count = Category.objects.count()
    Category.objects.all().delete()
    print(f"- Deleted {category_count} Categories.")

    # 4. Clear Notifications
    notification_count = Notification.objects.count()
    Notification.objects.all().delete()
    print(f"- Deleted {notification_count} Notifications.")

    print("Cleanup complete! Inventory is now empty and ready for fresh entries.")

if __name__ == "__main__":
    clear_dummy_data()
