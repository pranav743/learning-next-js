const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  tripId: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer is required']
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Driver is required']
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle is required']
  },
  source: {
    address: {
      type: String,
      required: [true, 'Source address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Source city is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Source state is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Source pincode is required'],
      match: [/^[1-9][0-9]{5}$/, 'Please enter a valid Indian pincode']
    }
  },
  destination: {
    address: {
      type: String,
      required: [true, 'Destination address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Destination city is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Destination state is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Destination pincode is required'],
      match: [/^[1-9][0-9]{5}$/, 'Please enter a valid Indian pincode']
    }
  },
  scheduledStartTime: {
    type: Date,
    required: [true, 'Scheduled start time is required']
  },
  scheduledEndTime: {
    type: Date,
    required: [true, 'Scheduled end time is required']
  },
  actualStartTime: {
    type: Date
  },
  actualEndTime: {
    type: Date
  },
  status: {
    type: String,
    enum: {
      values: ['scheduled', 'in_progress', 'completed', 'cancelled'],
      message: 'Status must be one of: scheduled, in_progress, completed, cancelled'
    },
    default: 'scheduled'
  },
  fare: {
    baseFare: {
      type: Number,
      required: [true, 'Base fare is required'],
      min: [0, 'Base fare cannot be negative']
    },
    extraCharges: {
      type: Number,
      default: 0,
      min: [0, 'Extra charges cannot be negative']
    },
    totalFare: {
      type: Number,
      required: [true, 'Total fare is required'],
      min: [0, 'Total fare cannot be negative']
    }
  },
  distance: {
    type: Number,
    min: [0, 'Distance cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'paid', 'failed', 'refunded'],
      message: 'Payment status must be one of: pending, paid, failed, refunded'
    },
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: {
      values: ['cash', 'card', 'upi', 'wallet'],
      message: 'Payment method must be one of: cash, card, upi, wallet'
    }
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for trip duration
tripSchema.virtual('duration').get(function() {
  if (this.actualStartTime && this.actualEndTime) {
    return Math.round((this.actualEndTime - this.actualStartTime) / (1000 * 60)); // Duration in minutes
  }
  return null;
});

// Pre-save middleware to generate trip ID
tripSchema.pre('save', function(next) {
  if (!this.tripId) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.tripId = `TRP${dateStr}${random}`;
  }
  
  // Calculate total fare
  this.fare.totalFare = this.fare.baseFare + this.fare.extraCharges;
  
  next();
});

// Pre-save validation
tripSchema.pre('save', function(next) {
  if (this.scheduledEndTime <= this.scheduledStartTime) {
    next(new Error('Scheduled end time must be after start time'));
  }
  
  if (this.actualStartTime && this.actualEndTime && this.actualEndTime <= this.actualStartTime) {
    next(new Error('Actual end time must be after start time'));
  }
  
  next();
});

// Index for better query performance
tripSchema.index({ customer: 1, status: 1 });
tripSchema.index({ driver: 1, status: 1 });
tripSchema.index({ scheduledStartTime: 1 });

// Static method to find trips by customer
tripSchema.statics.findByCustomer = function(customerId, status) {
  const query = { customer: customerId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('driver', 'firstName lastName phoneNumber')
    .populate('vehicle', 'vehicleNumber vehicleType make model')
    .sort({ scheduledStartTime: -1 });
};

// Static method to find trips by driver
tripSchema.statics.findByDriver = function(driverId, status) {
  const query = { driver: driverId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('customer', 'firstName lastName phoneNumber')
    .populate('vehicle', 'vehicleNumber vehicleType make model')
    .sort({ scheduledStartTime: -1 });
};

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;