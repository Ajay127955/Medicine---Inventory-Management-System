import os
import django
from datetime import date, timedelta

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from inventory.models import Category, Medicine
from django.contrib.auth import get_user_model

User = get_user_model()

def populate_real_data():
    print("Populating system with clinical-grade medical data...")

    # Define Categories
    categories_data = [
        {"name": "Antihyperlipidemic", "description": "Medications that lower high levels of lipids (fats) such as cholesterol."},
        {"name": "Antihypertensive", "description": "Medications used to treat high blood pressure."},
        {"name": "Antidiabetic", "description": "Medications used to treat diabetes mellitus by lowering glucose levels."},
        {"name": "Thyroid Hormone", "description": "Hormone replacement for hypothyroid conditions."},
        {"name": "Proton Pump Inhibitor", "description": "Medications that reduce stomach acid production."},
        {"name": "Bronchodilator", "description": "Medications used to treat asthma and COPD by opening airways."},
        {"name": "Analgesic", "description": "Medications used to achieve relief from pain."},
        {"name": "Antidepressant", "description": "Medications used to treat major depressive disorders."},
    ]

    category_map = {}
    for cat in categories_data:
        obj, created = Category.objects.get_or_create(name=cat['name'], defaults={'description': cat['description']})
        category_map[cat['name']] = obj
        if created:
            print(f"- Category Created: {cat['name']}")

    # Define Medicines
    medicines_data = [
        {"name": "Atorvastatin (Lipitor) 20mg", "category": "Antihyperlipidemic", "manufacturer": "Pfizer", "price": 45.50, "stock": 150},
        {"name": "Amlodipine (Norvasc) 5mg", "category": "Antihypertensive", "manufacturer": "Viatris", "price": 12.99, "stock": 200},
        {"name": "Lisinopril (Zestril) 10mg", "category": "Antihypertensive", "manufacturer": "Sandoz", "price": 9.45, "stock": 180},
        {"name": "Metformin (Glucophage) 500mg", "category": "Antidiabetic", "manufacturer": "Merck", "price": 7.20, "stock": 300},
        {"name": "Levothyroxine (Synthroid) 50mcg", "category": "Thyroid Hormone", "manufacturer": "AbbVie", "price": 18.00, "stock": 120},
        {"name": "Omeprazole (Prilosec) 20mg", "category": "Proton Pump Inhibitor", "manufacturer": "AstraZeneca", "price": 22.50, "stock": 90},
        {"name": "Albuterol (Ventolin) Inhaler", "category": "Bronchodilator", "manufacturer": "GSK", "price": 35.00, "stock": 50},
        {"name": "Gabapentin (Neurontin) 300mg", "category": "Analgesic", "manufacturer": "Pfizer", "price": 28.15, "stock": 110},
        {"name": "Sertraline (Zoloft) 50mg", "category": "Antidepressant", "manufacturer": "Viatris", "price": 15.60, "stock": 140},
        {"name": "Losartan (Cozaar) 50mg", "category": "Antihypertensive", "manufacturer": "Organon", "price": 11.30, "stock": 165},
    ]

    for med in medicines_data:
        Medicine.objects.get_or_create(
            name=med['name'],
            defaults={
                'category': category_map[med['category']],
                'manufacturer': med['manufacturer'],
                'price_per_unit': med['price'],
                'stock_quantity': med['stock'],
                'expiry_date': date.today() + timedelta(days=365),
                'unit': 'unit',
                'low_stock_threshold': 20
            }
        )
        print(f"- Medicine Added: {med['name']}")

    print("\nSystem population successful. Database is now updated with real medicine profiles.")

if __name__ == "__main__":
    populate_real_data()
