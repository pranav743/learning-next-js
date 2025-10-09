# Redis Caching Assignment - High-End Cars API

A Node.js Express application demonstrating Redis caching with cache invalidation for high-end cars data in India.

## 🚗 Features

- **CRUD Operations** for high-end cars data
- **Redis Caching** with TTL (Time To Live) of 1 minute
- **Cache Invalidation** on data modifications (POST, PUT, DELETE)
- **Console Logging** for cache hits/misses
- **JSON File Database** simulation
- **Windows 11 Redis Setup** instructions included

## 🏗️ Project Structure

```
├── data/
│   └── cars.json              # High-end cars database
├── models/
│   └── carDatabase.js         # Database operations
├── routes/
│   └── items.js              # API routes
├── services/
│   └── cacheService.js       # Redis caching service
├── server.js                 # Express server
├── package.json              # Dependencies
├── .env                      # Environment variables
└── README.md                 # This file
```

## 🚀 Setup Instructions

### Prerequisites

1. **Node.js** (v14 or higher)
2. **Yarn** package manager
3. **Redis** server

### Step 1: Install Dependencies

```bash
yarn install
```

### Step 2: Install and Setup Redis on Windows 11

#### Option A: Using Windows Subsystem for Linux (WSL) - Recommended

1. **Install WSL2** if not already installed:
   ```powershell
   wsl --install
   ```

2. **Install Redis in WSL**:
   ```bash
   # In WSL terminal
   sudo apt update
   sudo apt install redis-server
   
   # Start Redis
   sudo service redis-server start
   
   # Test Redis
   redis-cli ping
   # Should return: PONG
   ```

3. **Keep Redis running** in WSL while using the application.

#### Option B: Using Docker (Alternative)

1. **Install Docker Desktop** for Windows
2. **Run Redis container**:
   ```bash
   docker run -d --name redis-cache -p 6379:6379 redis:latest
   ```

#### Option C: Using Redis for Windows (Legacy)

1. Download Redis for Windows from GitHub releases
2. Extract and run `redis-server.exe`
3. Keep the server running on default port 6379

### Step 3: Configure Environment

The `.env` file is already configured with default Redis settings:
```
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=3000
```

### Step 4: Start the Application

```bash
# Development mode with auto-restart
yarn dev

# Or production mode
yarn start
```

The server will start on `http://localhost:3000`

## 📋 API Endpoints

### GET /items
Fetches all high-end cars with caching.

**Example:**
```bash
curl http://localhost:3000/items
```

**Response:**
```json
{
  "success": true,
  "source": "cache", // or "database"
  "data": [...],
  "message": "Cars data retrieved from Redis cache"
}
```

### POST /items
Adds a new car and invalidates cache.

**Example:**
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Ferrari",
    "model": "SF90 Stradale",
    "price": "₹7.50 Crore",
    "engine": "4.0L V8 + Electric",
    "power": "986 hp",
    "fuelType": "Hybrid",
    "features": ["KERS System", "Carbon Fiber Body", "F1 Technology"]
  }'
```

### PUT /items/:id
Updates an existing car and invalidates cache.

**Example:**
```bash
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": "₹1.75 Crore"
  }'
```

### DELETE /items/:id
Deletes a car and invalidates cache.

**Example:**
```bash
curl -X DELETE http://localhost:3000/items/1
```

## 🔄 Caching Behavior

1. **First GET /items** → Data fetched from JSON file → Cached in Redis (TTL: 1 minute)
2. **Second GET /items** → Data returned from Redis cache
3. **POST/PUT/DELETE** → Cache invalidated → Next GET will fetch fresh data
4. **After 1 minute** → Cache expires → Next GET fetches fresh data

## 🖥️ Console Output Examples

### Cache Hit:
```
🌐 GET /items - 2024-10-09T10:30:00.000Z
📋 GET /items - Fetching all cars
🎯 Cache HIT for key: cars:all
```

### Cache Miss:
```
🌐 GET /items - 2024-10-09T10:31:00.000Z
📋 GET /items - Fetching all cars
❌ Cache MISS for key: cars:all
🔍 Fetching from database...
✅ Data cached for key: cars:all (TTL: 60s)
```

### Cache Invalidation:
```
🌐 POST /items - 2024-10-09T10:32:00.000Z
➕ POST /items - Adding new car
🗑️ Cache invalidated for key: cars:all
✅ Added new car: Ferrari SF90 Stradale
```

## 🚗 Sample Cars Data

The application includes 10 high-end cars available in India:

- Mercedes-Benz S-Class S 400d (₹1.70 Crore)
- BMW 7 Series 740Li (₹1.50 Crore)
- Audi A8 L 60 TFSI (₹1.58 Crore)
- Jaguar XJ L Portfolio (₹1.11 Crore)
- Lexus LS 500h (₹1.88 Crore)
- Volvo S90 T8 Inscription (₹61.90 Lakh)
- Maserati Quattroporte GTS (₹1.74 Crore)
- Bentley Flying Spur V8 (₹3.10 Crore)
- Rolls-Royce Ghost (₹6.95 Crore)
- Porsche Panamera Turbo S (₹2.43 Crore)

## ✅ Success Criteria Met

- ✅ **Redis Caching**: Uses `get`, `set`, and `del` operations
- ✅ **Cache Invalidation**: POST, PUT, DELETE operations invalidate cache
- ✅ **Cache TTL**: 1-minute expiration time
- ✅ **Console Logging**: Clear cache hit/miss indicators
- ✅ **Express Server**: RESTful API structure
- ✅ **JSON Database**: File-based data simulation
- ✅ **Error Handling**: Comprehensive error responses

## 🛠️ Troubleshooting

### Redis Connection Issues

1. **Check if Redis is running**:
   ```bash
   # In WSL or Command Prompt
   redis-cli ping
   ```

2. **Check Redis logs** in WSL:
   ```bash
   sudo tail -f /var/log/redis/redis-server.log
   ```

3. **Restart Redis** in WSL:
   ```bash
   sudo service redis-server restart
   ```

### Application Issues

1. **Check logs** in the terminal where the app is running
2. **Verify .env file** configuration
3. **Ensure port 3000** is not in use by another application

## 📦 Dependencies

- **express**: Web framework
- **ioredis**: Redis client
- **dotenv**: Environment variable management
- **nodemon**: Development auto-restart (dev dependency)

## 👨‍💻 Author

**Pranav** - Redis Caching Assignment Implementation

---

**Note**: This implementation uses high-end luxury cars data specifically available in the Indian market, complete with Indian pricing in Crores and Lakhs.