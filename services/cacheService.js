const Redis = require('ioredis');

class CacheService {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
    });

    this.redis.on('connect', () => {
      console.log('✅ Connected to Redis');
    });

    this.redis.on('error', (err) => {
      console.error('❌ Redis connection error:', err);
    });

    this.CACHE_KEYS = {
      ALL_CARS: 'cars:all',
    };

    this.TTL = 60; // 1 minute in seconds
  }

  async get(key) {
    try {
      const data = await this.redis.get(key);
      if (data) {
        console.log(`🎯 Cache HIT for key: ${key}`);
        return JSON.parse(data);
      }
      console.log(`❌ Cache MISS for key: ${key}`);
      return null;
    } catch (error) {
      console.error('Error getting from cache:', error);
      return null;
    }
  }

  async set(key, data, ttl = this.TTL) {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(data));
      console.log(`✅ Data cached for key: ${key} (TTL: ${ttl}s)`);
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  async del(key) {
    try {
      await this.redis.del(key);
      console.log(`🗑️ Cache invalidated for key: ${key}`);
    } catch (error) {
      console.error('Error deleting from cache:', error);
    }
  }

  async invalidateAllCarsCache() {
    await this.del(this.CACHE_KEYS.ALL_CARS);
  }

  async disconnect() {
    await this.redis.disconnect();
  }
}

module.exports = CacheService;