const express = require('express');
const Toy = require('../models/Toy');

const router = express.Router();

// Fetch sample toys from a public online API and return them (no auth required)
// Optional `?persist=true` will store the fetched toys in MongoDB if they don't already exist.
router.get('/toys', async (req, res) => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();

    const toys = data.map(item => ({
      name: item.title,
      description: item.description,
      price: Math.round(item.price * 100),
      images: [item.image],
      category: item.category,
      ageGroup: '3-8 years',
      artisan: {
        name: 'Online Artisan',
        location: 'Global',
        story: 'Imported from a public toy catalog.'
      },
      uniqueId: `EXT-${item.id}`,
      isAdoptable: false,
      history: []
    }));

    if (req.query.persist === 'true') {
      const existingIds = new Set((await Toy.find({ uniqueId: { $in: toys.map(t => t.uniqueId) } })).map(t => t.uniqueId));
      const toInsert = toys.filter(t => !existingIds.has(t.uniqueId));
      if (toInsert.length) {
        await Toy.insertMany(toInsert);
      }
    }

    res.json(toys);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch toys from external source' });
  }
});

module.exports = router;
