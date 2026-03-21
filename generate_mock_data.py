import re, json, random, os

with open('pdf_output_utf8.txt', 'r', encoding='utf-8') as f:
    text = f.read().strip().split('\n')[1:]

images = [f for f in os.listdir('frontend/public/images/') if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]

toys = []
for idx, line in enumerate(text):
    if not line.strip(): continue
    parts = line.split(' ', 1)
    if len(parts) < 2: continue
    rest = parts[1]
    
    # Naive split: first few words as name, rest as description
    match = re.match(r'^((?:[A-Z][\w\-&/]+(?:\s+|\s*\(\w+\)\s*))+)(.*)$', rest)
    if match and len(match.group(1)) > 5:
        name = match.group(1).strip()
        desc = match.group(2).strip()
        if not desc:
            desc = name
    else:
        # Fallback
        words = rest.split(' ')
        mid = len(words)//2 if len(words)>3 else 2
        name = ' '.join(words[:mid])
        desc = ' '.join(words[mid:])
        
    image = f"/images/{images[idx % len(images)]}" if len(images) > 0 else "https://via.placeholder.com/300"
    
    toys.append({
        "_id": str(idx+1),
        "name": name,
        "description": desc,
        "price": random.randint(5, 50) * 100 - 1,
        "rating": round(random.uniform(4.0, 5.0), 1),
        "category": random.choice(['Baby Toys', 'Educational Toys', 'Decorative Toys', 'Puzzle Toys', 'Vehicles', 'Animals']),
        "ageGroup": random.choice(['0-2 years', '3-5 years', '6-8 years', '9+ years']),
        "image": image,
        "features": ["100% Non-toxic", "Hand-painted", "Sustainable Wood", "Child Safe"],
        "artisan": {
            "name": random.choice(["Ravi Kumar", "Priya Sharma", "Meera Patel", "Rajesh", "Suresh"]),
            "location": "Channapatna, Karnataka",
            "story": "A dedicated artisan creating sustainable traditional toys."
        },
        "reviews": random.randint(10, 150)
    })

with open('frontend/src/store/mockToys.js', 'w', encoding='utf-8') as f:
    f.write('export const mockToys = ' + json.dumps(toys, indent=2) + ';\n')
