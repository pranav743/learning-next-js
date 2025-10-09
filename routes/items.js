const express = require('express');
const CarDatabase = require('../models/carDatabase');
const CacheService = require('../services/cacheService');

const router = express.Router();
const carDB = new CarDatabase();
const cache = new CacheService();

// GET /items - Fetch all cars with caching
router.get('/', async (req, res) => {
  try {
    console.log('\n📋 GET /items - Fetching all cars');
    
    // Try to get data from cache first
    const cachedCars = await cache.get(cache.CACHE_KEYS.ALL_CARS);
    
    if (cachedCars) {
      return res.json({
        success: true,
        source: 'cache',
        data: cachedCars,
        message: 'Cars data retrieved from Redis cache'
      });
    }

    // Cache miss - fetch from database
    console.log('🔍 Fetching from database...');
    const cars = await carDB.getAllCars();
    
    // Cache the data
    await cache.set(cache.CACHE_KEYS.ALL_CARS, cars);
    
    res.json({
      success: true,
      source: 'database',
      data: cars,
      message: 'Cars data retrieved from database and cached'
    });

  } catch (error) {
    console.error('Error in GET /items:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// POST /items - Add a new car
router.post('/', async (req, res) => {
  try {
    console.log('\n➕ POST /items - Adding new car');
    
    const { brand, model, price, engine, power, fuelType, features } = req.body;
    
    // Validate required fields
    if (!brand || !model || !price) {
      return res.status(400).json({
        success: false,
        message: 'Brand, model, and price are required fields'
      });
    }

    // Add car to database
    const newCar = await carDB.addCar({
      brand,
      model,
      price,
      engine,
      power,
      fuelType,
      features: features || []
    });

    // Invalidate cache
    await cache.invalidateAllCarsCache();
    
    console.log(`✅ Added new car: ${newCar.brand} ${newCar.model}`);
    
    res.status(201).json({
      success: true,
      data: newCar,
      message: 'Car added successfully and cache invalidated'
    });

  } catch (error) {
    console.error('Error in POST /items:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// PUT /items/:id - Update a car by ID
router.put('/:id', async (req, res) => {
  try {
    console.log(`\n✏️ PUT /items/${req.params.id} - Updating car`);
    
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if car exists and update
    const updatedCar = await carDB.updateCar(id, updateData);
    
    if (!updatedCar) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Invalidate cache
    await cache.invalidateAllCarsCache();
    
    console.log(`✅ Updated car: ${updatedCar.brand} ${updatedCar.model}`);
    
    res.json({
      success: true,
      data: updatedCar,
      message: 'Car updated successfully and cache invalidated'
    });

  } catch (error) {
    console.error('Error in PUT /items/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// DELETE /items/:id - Delete a car by ID
router.delete('/:id', async (req, res) => {
  try {
    console.log(`\n🗑️ DELETE /items/${req.params.id} - Deleting car`);
    
    const { id } = req.params;
    
    // Check if car exists and delete
    const deletedCar = await carDB.deleteCar(id);
    
    if (!deletedCar) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Invalidate cache
    await cache.invalidateAllCarsCache();
    
    console.log(`✅ Deleted car: ${deletedCar.brand} ${deletedCar.model}`);
    
    res.json({
      success: true,
      data: deletedCar,
      message: 'Car deleted successfully and cache invalidated'
    });

  } catch (error) {
    console.error('Error in DELETE /items/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;