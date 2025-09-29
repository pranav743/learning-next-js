const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle number is required'],
    unique: true,
    uppercase: true,
    trim: true,
    match: [
      /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/,
      'Please enter a valid Indian vehicle number (e.g., MH12AB1234)'
    ]
  },
  vehicleType: {
    type: String,
    enum: {
      values: ['car', 'bus', 'truck', 'motorcycle', 'auto-rickshaw', 'tempo'],
      message: 'Vehicle type must be one of: car, bus, truck, motorcycle, auto-rickshaw, tempo'
    },
    required: [true, 'Vehicle type is required']
  },
  make: {
    type: String,
    required: [true, 'Vehicle make is required'],
    trim: true,
    maxlength: [50, 'Make cannot exceed 50 characters']
  },
  model: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true,
    maxlength: [50, 'Model cannot exceed 50 characters']
  },
  year: {
    type: Number,
    required: [true, 'Manufacturing year is required'],
    min: [1990, 'Year must be 1990 or later'],
    max: [new Date().getFullYear(), `Year cannot be greater than ${new Date().getFullYear()}`]
  },
  capacity: {
    type: Number,
    required: [true, 'Vehicle capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [100, 'Capacity cannot exceed 100']
  },
  fuelType: {
    type: String,
    enum: {
      values: ['petrol', 'diesel', 'cng', 'electric', 'hybrid'],
      message: 'Fuel type must be one of: petrol, diesel, cng, electric, hybrid'
    },
    required: [true, 'Fuel type is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vehicle owner is required']
  },
  currentDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  registrationDate: {
    type: Date,
    required: [true, 'Registration date is required']
  },
  insuranceExpiry: {
    type: Date,
    required: [true, 'Insurance expiry date is required']
  },
  pucExpiry: {
    type: Date,
    required: [true, 'PUC expiry date is required']
  },
  averageMileage: {
    type: Number,
    min: [5, 'Mileage must be at least 5 km/l'],
    max: [50, 'Mileage cannot exceed 50 km/l']
  },
  location: {
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^[1-9][0-9]{5}$/, 'Please enter a valid Indian pincode']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for vehicle age
vehicleSchema.virtual('age').get(function() {
  return new Date().getFullYear() - this.year;
});

// Virtual for insurance status
vehicleSchema.virtual('insuranceStatus').get(function() {
  const today = new Date();
  const daysToExpiry = Math.ceil((this.insuranceExpiry - today) / (1000 * 60 * 60 * 24));
  
  if (daysToExpiry < 0) return 'expired';
  if (daysToExpiry <= 30) return 'expiring_soon';
  return 'valid';
});

// Index for better query performance
vehicleSchema.index({ owner: 1, vehicleType: 1, isActive: 1 });
vehicleSchema.index({ 'location.city': 1, 'location.state': 1 });

// Pre-save middleware
vehicleSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to find vehicles by owner
vehicleSchema.statics.findByOwner = function(ownerId) {
  return this.find({ owner: ownerId, isActive: true }).populate('owner currentDriver');
};

// Static method to find available vehicles in a location
vehicleSchema.statics.findAvailableInLocation = function(city, state) {
  return this.find({
    'location.city': new RegExp(city, 'i'),
    'location.state': new RegExp(state, 'i'),
    isActive: true,
    currentDriver: { $exists: false }
  }).populate('owner');
};

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;