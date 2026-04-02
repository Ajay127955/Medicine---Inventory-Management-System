import os
import django
import random
from datetime import datetime, timedelta

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from inventory.models import Category, Medicine
from orders.models import Order, OrderItem

User = get_user_model()

def seed_data():
    print("Seeding initiated...")
    
    # 1. Create Users
    admin, created = User.objects.get_or_create(
        username='admin',
        defaults={'email': 'admin@hospital.com', 'role': 'admin', 'is_staff': True, 'is_superuser': True}
    )
    if created:
        admin.set_password('admin123')
        admin.save()
        print("- Admin user created (admin/admin123)")

    shop_owner, created = User.objects.get_or_create(
        username='shop_owner',
        defaults={'email': 'shop@medicine.com', 'role': 'shop_owner'}
    )
    if created:
        shop_owner.set_password('shop123')
        shop_owner.save()
        print("- Shop owner user created (shop_owner/shop123)")

    supplier, created = User.objects.get_or_create(
        username='supplier',
        defaults={'email': 'supplier@pharma.com', 'role': 'supplier'}
    )
    if created:
        supplier.set_password('supplier123')
        supplier.save()
        print("- Supplier user created (supplier/supplier123)")

    # 2. Create Categories
    categories = ['Antibiotics', 'Painkillers', 'Vaccines', 'Vitamins', 'Cardiovascular']
    category_objs = []
    for cat_name in categories:
        cat, _ = Category.objects.get_or_create(name=cat_name)
        category_objs.append(cat)
    print(f"- {len(category_objs)} Categories created")

    # 3. Create Medicines
    medicines_data = [
        ('Amoxicillin', 'Antibiotics', 'GSK', 12.50, 50, 'tablet'),
        ('Paracetamol', 'Painkillers', 'Pfizer', 5.00, 200, 'tablet'),
        ('Ibuprofen', 'Painkillers', 'Bayer', 8.75, 8, 'tablet'), # Low stock
        ('Insulin Glargine', 'Cardiovascular', 'Sanofi', 45.00, 15, 'ml'),
        ('Multivitamin AZ', 'Vitamins', 'Centrum', 18.00, 100, 'capsule'),
        ('Atorvastatin', 'Cardiovascular', 'Viatris', 22.00, 4, 'tablet'), # Low stock
    ]

    for name, cat_name, mfr, price, stock, unit in medicines_data:
        cat = Category.objects.get(name=cat_name)
        Medicine.objects.get_or_create(
            name=name,
            defaults={
                'category': cat,
                'manufacturer': mfr,
                'price_per_unit': price,
                'stock_quantity': stock,
                'unit': unit,
                'expiry_date': datetime.now().date() + timedelta(days=365),
                'supplier': supplier
            }
        )
    print(f"- {len(medicines_data)} Medicines created")

    # 4. Create dummy orders for shop owner
    if Order.objects.count() == 0:
        for i in range(3):
            order = Order.objects.create(
                user=shop_owner,
                status=random.choice(['pending', 'approved', 'shipped']),
                notes=f"Refill for shelf section {i+1}"
            )
            # Add 2 items per order
            meds = Medicine.objects.all().order_by('?')[:2]
            for med in meds:
                OrderItem.objects.create(
                    order=order,
                    medicine=med,
                    quantity=random.randint(5, 20),
                    unit_price=med.price_per_unit
                )
            order.calculate_total()
        print("- 3 Dummy orders created for Shop Owner")

    print("Seeding complete!")

if __name__ == "__main__":
    seed_data()
