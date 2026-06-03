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

let cachedConnection = globalWithMongo.mongoConnection;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedConnection.client) {
    return { client: cachedConnection.client, db: cachedConnection.db! };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();

  const db = client.db('kaffeine');

  cachedConnection.client = client;
  cachedConnection.db = db;

  return { client, db };
}

export async function getDatabase(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}
