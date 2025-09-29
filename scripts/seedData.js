require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Vehicle = require('../src/models/Vehicle');
const Trip = require('../src/models/Trip');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Sample Indian data
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Trip.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create sample users
    const users = [
      // Admins
      {
        email: 'admin@travelmanagement.com',
        password: 'Admin@123',
        role: 'admin',
        firstName: 'Rajesh',
        lastName: 'Sharma',
        phoneNumber: '9876543210'
      },
      
      // Vehicle Owners
      {
        email: 'owner1@gmail.com',
        password: 'Owner@123',
        role: 'owner',
        firstName: 'Suresh',
        lastName: 'Patel',
        phoneNumber: '9123456789'
      },
      {
        email: 'owner2@gmail.com',
        password: 'Owner@123',
        role: 'owner',
        firstName: 'Meera',
        lastName: 'Singh',
        phoneNumber: '9234567890'
      },
      {
        email: 'owner3@gmail.com',
        password: 'Owner@123',
        role: 'owner',
        firstName: 'Arvind',
        lastName: 'Kumar',
        phoneNumber: '9345678901'
      },
      
      // Drivers
      {
        email: 'driver1@gmail.com',
        password: 'Driver@123',
        role: 'driver',
        firstName: 'Ramesh',
        lastName: 'Yadav',
        phoneNumber: '9456789012'
      },
      {
        email: 'driver2@gmail.com',
        password: 'Driver@123',
        role: 'driver',
        firstName: 'Vikram',
        lastName: 'Thakur',
        phoneNumber: '9567890123'
      },
      {
        email: 'driver3@gmail.com',
        password: 'Driver@123',
        role: 'driver',
        firstName: 'Santosh',
        lastName: 'Gupta',
        phoneNumber: '9678901234'
      },
      {
        email: 'driver4@gmail.com',
        password: 'Driver@123',
        role: 'driver',
        firstName: 'Ajay',
        lastName: 'Verma',
        phoneNumber: '9789012345'
      },
      
      // Customers
      {
        email: 'customer1@gmail.com',
        password: 'Customer@123',
        role: 'customer',
        firstName: 'Priya',
        lastName: 'Agarwal',
        phoneNumber: '9890123456'
      },
      {
        email: 'customer2@gmail.com',
        password: 'Customer@123',
        role: 'customer',
        firstName: 'Amit',
        lastName: 'Joshi',
        phoneNumber: '9901234567'
      },
      {
        email: 'customer3@gmail.com',
        password: 'Customer@123',
        role: 'customer',
        firstName: 'Sneha',
        lastName: 'Mehta',
        phoneNumber: '9012345678'
      },
      {
        email: 'customer4@gmail.com',
        password: 'Customer@123',
        role: 'customer',
        firstName: 'Karan',
        lastName: 'Malhotra',
        phoneNumber: '9123450987'
      }
    ];

    const createdUsers = await User.create(users);
    console.log('👥 Created sample users');

    // Get user IDs by role
    const admins = createdUsers.filter(user => user.role === 'admin');
    const owners = createdUsers.filter(user => user.role === 'owner');
    const drivers = createdUsers.filter(user => user.role === 'driver');
    const customers = createdUsers.filter(user => user.role === 'customer');

    // Create sample vehicles
    const vehicles = [
      // Owner 1 vehicles
      {
        vehicleNumber: 'MH12AB1234',
        vehicleType: 'car',
        make: 'Maruti Suzuki',
        model: 'Swift Dzire',
        year: 2020,
        capacity: 4,
        fuelType: 'petrol',
        owner: owners[0]._id,
        registrationDate: new Date('2020-03-15'),
        insuranceExpiry: new Date('2025-03-15'),
        pucExpiry: new Date('2024-12-15'),
        averageMileage: 18,
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        }
      },
      {
        vehicleNumber: 'MH14CD5678',
        vehicleType: 'bus',
        make: 'Tata',
        model: 'Ultra',
        year: 2019,
        capacity: 30,
        fuelType: 'diesel',
        owner: owners[0]._id,
        registrationDate: new Date('2019-06-20'),
        insuranceExpiry: new Date('2025-06-20'),
        pucExpiry: new Date('2024-11-20'),
        averageMileage: 12,
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400002'
        }
      },
      
      // Owner 2 vehicles
      {
        vehicleNumber: 'DL01EF9876',
        vehicleType: 'car',
        make: 'Hyundai',
        model: 'Creta',
        year: 2021,
        capacity: 5,
        fuelType: 'diesel',
        owner: owners[1]._id,
        registrationDate: new Date('2021-01-10'),
        insuranceExpiry: new Date('2025-01-10'),
        pucExpiry: new Date('2024-10-10'),
        averageMileage: 20,
        location: {
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110001'
        }
      },
      {
        vehicleNumber: 'DL03GH1357',
        vehicleType: 'auto-rickshaw',
        make: 'Bajaj',
        model: 'RE Compact',
        year: 2020,
        capacity: 3,
        fuelType: 'cng',
        owner: owners[1]._id,
        registrationDate: new Date('2020-08-25'),
        insuranceExpiry: new Date('2025-08-25'),
        pucExpiry: new Date('2024-12-25'),
        averageMileage: 25,
        location: {
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110002'
        }
      },
      
      // Owner 3 vehicles
      {
        vehicleNumber: 'KA05IJ2468',
        vehicleType: 'car',
        make: 'Toyota',
        model: 'Innova Crysta',
        year: 2022,
        capacity: 7,
        fuelType: 'diesel',
        owner: owners[2]._id,
        registrationDate: new Date('2022-02-14'),
        insuranceExpiry: new Date('2026-02-14'),
        pucExpiry: new Date('2025-02-14'),
        averageMileage: 15,
        location: {
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001'
        }
      },
      {
        vehicleNumber: 'KA07KL8024',
        vehicleType: 'motorcycle',
        make: 'Royal Enfield',
        model: 'Classic 350',
        year: 2021,
        capacity: 2,
        fuelType: 'petrol',
        owner: owners[2]._id,
        registrationDate: new Date('2021-05-30'),
        insuranceExpiry: new Date('2025-05-30'),
        pucExpiry: new Date('2024-11-30'),
        averageMileage: 35,
        location: {
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560002'
        }
      }
    ];

    const createdVehicles = await Vehicle.create(vehicles);
    console.log('🚗 Created sample vehicles');

    // Assign drivers to vehicles
    const vehicleDriverAssignments = [
      { vehicleId: createdVehicles[0]._id, driverId: drivers[0]._id },
      { vehicleId: createdVehicles[1]._id, driverId: drivers[1]._id },
      { vehicleId: createdVehicles[2]._id, driverId: drivers[2]._id },
      { vehicleId: createdVehicles[3]._id, driverId: drivers[3]._id },
      { vehicleId: createdVehicles[4]._id, driverId: drivers[0]._id }, // Driver can have multiple vehicles
      // Leave motorcycle without driver (available)
    ];

    for (const assignment of vehicleDriverAssignments) {
      await Vehicle.findByIdAndUpdate(
        assignment.vehicleId,
        { currentDriver: assignment.driverId }
      );
    }
    console.log('👨‍✈️ Assigned drivers to vehicles');

    // Create sample trips
    const trips = [
      {
        customer: customers[0]._id,
        driver: drivers[0]._id,
        vehicle: createdVehicles[0]._id,
        source: {
          address: 'Gateway of India, Apollo Bandar',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        destination: {
          address: 'Chhatrapati Shivaji Terminus',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        scheduledStartTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        scheduledEndTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
        fare: {
          baseFare: 250,
          extraCharges: 50,
          totalFare: 300
        },
        distance: 8,
        paymentMethod: 'upi',
        notes: 'Pick up from main gate'
      },
      {
        customer: customers[1]._id,
        driver: drivers[1]._id,
        vehicle: createdVehicles[1]._id,
        source: {
          address: 'Andheri West Metro Station',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400053'
        },
        destination: {
          address: 'Bandra Kurla Complex',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400051'
        },
        scheduledStartTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        scheduledEndTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        actualStartTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        actualEndTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
        status: 'completed',
        fare: {
          baseFare: 500,
          extraCharges: 0,
          totalFare: 500
        },
        distance: 15,
        paymentMethod: 'card',
        paymentStatus: 'paid'
      },
      {
        customer: customers[2]._id,
        driver: drivers[2]._id,
        vehicle: createdVehicles[2]._id,
        source: {
          address: 'Connaught Place',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110001'
        },
        destination: {
          address: 'India Gate',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110003'
        },
        scheduledStartTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
        scheduledEndTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
        fare: {
          baseFare: 180,
          extraCharges: 20,
          totalFare: 200
        },
        distance: 5,
        paymentMethod: 'cash'
      }
    ];

    const createdTrips = await Trip.create(trips);
    console.log('🗺️ Created sample trips');

    console.log('\n🎉 Sample data seeded successfully!');
    console.log('\n📝 Sample Login Credentials:');
    console.log('Admin: admin@travelmanagement.com / Admin@123');
    console.log('Owner: owner1@gmail.com / Owner@123');
    console.log('Driver: driver1@gmail.com / Driver@123');
    console.log('Customer: customer1@gmail.com / Customer@123');

    console.log('\n📊 Database Summary:');
    console.log(`Users: ${createdUsers.length}`);
    console.log(`- Admins: ${admins.length}`);
    console.log(`- Owners: ${owners.length}`);
    console.log(`- Drivers: ${drivers.length}`);
    console.log(`- Customers: ${customers.length}`);
    console.log(`Vehicles: ${createdVehicles.length}`);
    console.log(`Trips: ${createdTrips.length}`);

  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
  }
};

// Run seeder
const runSeeder = async () => {
  await connectDB();
  await seedData();
  await mongoose.connection.close();
  console.log('🔌 Database connection closed');
  process.exit(0);
};

runSeeder();