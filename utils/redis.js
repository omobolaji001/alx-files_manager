import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (error) => {
      console.log(`Redis client not connected to server: ${error.message}`);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const redisGet = promisify(this.client.get).bind(this.client);
    const result = await redisGet(key);
    return result;
  }

  async set(key, value, duration) {
    const redisSet = promisify(this.client.set).bind(this.client);
    await redisSet(key, value);
    await this.client.expire(key, duration);
  }

  async del(key) {
    const redisDel = promisify(this.client.del).bind(this.client);
    await redisDel(key);
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
