import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from accounts.models import CustomUser

def seed_shop_owners():
    print("Provisioning clinical access for Shop Owners...")
    
    users_data = [
        {"username": "oscar_pharmacy", "email": "oscar@pharmacy.com", "phone": "+1-555-0123", "address": "742 Evergreen Terrace"},
        {"username": "elite_clinics", "email": "admin@eliteclinics.org", "phone": "+1-555-9876", "address": "42 Wallaby Way, Sydney"},
        {"username": "city_med_center", "email": "support@citymed.com", "phone": "+1-555-4567", "address": "221B Baker Street"},
    ]

    for data in users_data:
        user, created = CustomUser.objects.get_or_create(
            username=data['username'],
            defaults={
                'email': data['email'],
                'role': 'shop_owner',
                'phone_number': data['phone'],
                'address': data['address']
            }
        )
        if created:
            user.set_password('shop123')
            user.save()
            print(f"- Provisioned: {data['username']} (Password: shop123)")
        else:
            print(f"- Exists: {data['username']}")

    print("\nUser registry updated. Visit http://localhost:5176/admin/users to manage these identities.")

if __name__ == "__main__":
    seed_shop_owners()
