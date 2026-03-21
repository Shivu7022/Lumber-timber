const fs = require('fs');
const path = require('path');

try {
  const imagesDir = path.join(__dirname, '../frontend/public/images');
  const files = fs.readdirSync(imagesDir);

  // Filter out any non-image files if there are any
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f));

  // Determine categories dynamically
  const categories = ['Educational Toys', 'Animals', 'Decorative Toys', 'Baby Toys', 'Puzzle Toys', 'Vehicles', 'Dolls'];
  const ageGroups = ['0-2 years', '3-5 years', '6-8 years', '9+ years'];
  
  // Format filename to Title Case e.g "adopt-racecar.jpg.jpeg" -> "Adopt Racecar"
  const formatName = (filename) => {
    let name = filename.replace(/\.[^/.]+$/, "").replace(/\.[^/.]+$/, ""); // strip 1 or 2 extensions
    name = name.replace(/[-_]/g, " "); // replace dashes & underscores
    name = name.replace(/[0-9]/g, ""); // remove numbers
    name = name.trim();
    if (!name) name = "Channapatna Craft";
    
    // Capitalize words
    return name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const sampleToys = imageFiles.map((filename, i) => {
    let rawName = formatName(filename);
    if(rawName.length < 3) rawName = `Channapatna Craft ${i+1}`;

    const catIndex = i % categories.length;
    const category = categories[catIndex];

    return {
      name: `Wooden ${rawName}`,
      description: `Beautiful handcrafted ${rawName} toy. Made with sustainable ivory wood (Aale Mara) and colored with vibrant natural vegetable dyes. Perfect for all ages.`,
      price: Math.floor(Math.random() * 2000) + 499, // random price between 499 and 2499
      images: [`/images/${filename}`],
      category: category,
      ageGroup: ageGroups[i % ageGroups.length],
      rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
      reviews: Math.floor(Math.random() * 200) + 5,
      artisan: {
        name: i % 3 === 0 ? 'Priya Sharma' : (i % 3 === 1 ? 'Rajesh Rao' : 'Meera Patel'),
        location: 'Channapatna, Karnataka',
        story: 'A dedicated artisan crafting beautiful sustainable toys.'
      },
      uniqueId: `CH-${Date.now().toString().slice(-6)}-${i+1}`,
      isAdoptable: true,
      history: [
        { event: 'Crafted on traditional lathe', date: new Date(), user: 'Artisan' }
      ]
    };
  });

  fs.writeFileSync(path.join(__dirname, 'seedData.json'), JSON.stringify(sampleToys, null, 2));
  console.log(`Successfully generated ${sampleToys.length} unique toys from images to seedData.json`);
} catch (error) {
  console.error("Failed to convert:", error);
}
