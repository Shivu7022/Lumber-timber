const fs = require('fs');
const path = require('path');

try {
  const mockPath = path.join(__dirname, '../frontend/src/store/mockToys.js');
  let content = fs.readFileSync(mockPath, 'utf8');

  // Remove the export statement to just leave the array
  content = content.replace('export const mockToys = ', '');
  // Remove the trailing semicolon if it exists
  content = content.trim().replace(/;$/, '');

  // Safely evaluate the array (since it's just raw JS objects)
  const toys = eval(content);

  const sampleToys = toys.map(toy => ({
    name: toy.name,
    description: toy.description || "Beautiful handcrafted Channapatna toy, colored with natural vegetable dyes.",
    price: toy.price,
    images: [toy.image],
    category: toy.category,
    ageGroup: toy.ageGroup,
    artisan: toy.artisan,
    uniqueId: `CH-2024-${toy._id}`,
    isAdoptable: true,
    history: [
      { event: 'Crafted on traditional lathe', date: new Date(), user: toy.artisan?.name || 'Artisan' }
    ]
  }));

  fs.writeFileSync(path.join(__dirname, 'seedData.json'), JSON.stringify(sampleToys, null, 2));
  console.log(`Successfully converted ${sampleToys.length} toys to seedData.json`);
} catch (error) {
  console.error("Failed to convert:", error);
}
