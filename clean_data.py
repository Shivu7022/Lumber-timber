import json

with open('frontend/src/store/mockToys.js', 'r', encoding='utf-8') as f:
    content = f.read()

# remove 'export const mockToys = ' and ';\n'
json_str = content.replace('export const mockToys = ', '').strip()
if json_str.endswith(';'):
    json_str = json_str[:-1]

data = json.loads(json_str)

for item in data:
    # clean name
    name = item['name']
    desc = item['description']
    
    # Sometimes desc starts with an ampersand or continuation of the name
    if desc.startswith('&') or desc.startswith('and') or name.endswith(' '):
        # We need a better heuristic. Usually, the first 3-5 words are the name.
        pass
    
    # Just do some basic cleanups
    full_text = name + " " + desc
    words = full_text.split()
    
    # Try to find the transition from Title Case to lower case
    split_index = len(words) // 2
    for i, w in enumerate(words):
        if i > 1 and w.islower() and w not in ['and', 'with', 'for', 'the', 'in', 'of']:
            split_index = i
            break
            
    if split_index == len(words):
        split_index = len(words) // 2
        
    new_name = " ".join(words[:split_index])
    new_desc = " ".join(words[split_index:])
    
    item['name'] = new_name.title()
    item['description'] = new_desc.capitalize()

with open('frontend/src/store/mockToys.js', 'w', encoding='utf-8') as f:
    f.write('export const mockToys = ' + json.dumps(data, indent=2) + ';\n')
