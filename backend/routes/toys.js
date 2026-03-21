const express = require('express');
const Toy = require('../models/Toy');
const auth = require('../middleware/auth');
const { upload } = require('../utils/s3');

const router = express.Router();

// Get all toys with pagination, filtering, search, and sorting
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, search, brand, category, sort, maxPrice, minRating, ageGroup } = req.query;
    
    let query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (brand) query['artisan.name'] = { $in: brand.split(',') };
    if (category) query.category = { $in: category.split(',') };
    if (ageGroup) query.ageGroup = { $in: ageGroup.split(',') };
    if (maxPrice) query.price = { $lte: Number(maxPrice) };
    if (minRating) query.rating = { $gte: Number(minRating) };
    
    let sortObj = { createdAt: -1 }; // default
    if (sort === 'popular') sortObj.rating = -1;
    if (sort === 'price_asc') sortObj.price = 1;
    if (sort === 'price_desc') sortObj.price = -1;
    
    const count = await Toy.countDocuments(query);
    const toys = await Toy.find(query)
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
      
    // Maintain backwards compatibility for basic arrays if requested, else return paginated object
    if (req.query.format === 'array') {
       return res.json(toys);
    }
      
    res.json({
      toys,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalToys: count
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get toy by ID
router.get('/:id', async (req, res) => {
  try {
    const toy = await Toy.findById(req.params.id);
    if (!toy) {
      return res.status(404).json({ msg: 'Toy not found' });
    }
    res.json(toy);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add new toy (admin only)
router.post('/', auth, async (req, res) => {
  const { name, description, price, images, category, ageGroup, artisan, uniqueId } = req.body;

  try {
    const toy = new Toy({
      name,
      description,
      price,
      images,
      category,
      ageGroup,
      artisan,
      uniqueId
    });

    await toy.save();
    res.json(toy);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Upload toy image to S3
router.post('/upload', auth, (req, res) => {
  // We use the upload instance manually to catch S3 configuration errors gracefully
  upload.single('image')(req, res, function (err) {
    if (err) {
      console.error('S3 Upload Error:', err.message);
      // Fallback for demo if S3 is not completely configured
      return res.json({ 
        msg: 'S3 Upload failed, returning mock image', 
        imageUrl: `https://picsum.photos/seed/${Date.now()}/800/800` 
      });
    }
    
    // File uploaded successfully
    if (!req.file) {
      return res.status(400).json({ msg: 'Please provide an image' });
    }
    
    // req.file.location is populated by multer-s3
    res.json({ imageUrl: req.file.location });
  });
});

// Update toy
router.put('/:id', auth, async (req, res) => {
  try {
    const toy = await Toy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!toy) {
      return res.status(404).json({ msg: 'Toy not found' });
    }
    res.json(toy);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete toy
router.delete('/:id', auth, async (req, res) => {
  try {
    const toy = await Toy.findByIdAndDelete(req.params.id);
    if (!toy) {
      return res.status(404).json({ msg: 'Toy not found' });
    }
    res.json({ msg: 'Toy removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;