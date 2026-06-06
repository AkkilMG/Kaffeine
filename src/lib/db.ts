import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kaffeine';

if (!MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

interface MongoConnection {
  client: MongoClient | null;
  db: Db | null;
}

const globalWithMongo = global as typeof globalThis & {
  mongoConnection: MongoConnection;
};

// Initialize cache
if (!globalWithMongo.mongoConnection) {
  globalWithMongo.mongoConnection = { client: null, db: null };
}

const cachedConnection = globalWithMongo.mongoConnection;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedConnection.client) {
    return { client: cachedConnection.client, db: cachedConnection.db! };
  }

  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 3000,
    socketTimeoutMS: 5000,
  });
  await client.connect();

  const db = client.db('kaffeine');

  cachedConnection.client = client;
  cachedConnection.db = db;

  // Ensure indexes on startup (non-blocking)
  Promise.all([
    db.collection('kaffeiners').createIndex({ userId: 1, active: 1 }, { background: true }),
    db.collection('status').createIndex({ kaffeiner_id: 1, time: -1 }, { background: true }),
    db.collection('status').createIndex({ time: 1 }, { expireAfterSeconds: 2592000, background: true }), // TTL: 30 days
    db.collection('users').createIndex({ email: 1 }, { unique: true, background: true }),
  ]).catch(() => {});

  return { client, db };
}

export async function getDatabase(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}
