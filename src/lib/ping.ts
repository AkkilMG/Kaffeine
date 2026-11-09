/**
 * Shared health-check ping utilities.
 * Used by both the kaffeiner creation API (to validate connectivity before saving)
 * and the Cloudflare Worker health-check API (to perform recurring checks).
 */

export async function pingWebsite(uri: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(uri, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'User-Agent': 'Kaffeine/1.0' },
    });
    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
}

export async function pingMongoDB(uri: string, _collection?: string): Promise<boolean> {
  try {
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    await client.connect();
    const db = client.db();
    await db.command({ ping: 1 });
    await client.close();
    return true;
  } catch {
    return false;
  }
}

export async function pingSQL(uri: string, _table?: string): Promise<boolean> {
  try {
    const url = new URL(uri);
    const { connect } = await import('net');
    return new Promise((resolve) => {
      const socket = connect(
        parseInt(url.port || '5432'),
        url.hostname,
        () => {
          socket.destroy();
          resolve(true);
        }
      );
      socket.on('error', () => resolve(false));
      socket.setTimeout(10000, () => {
        socket.destroy();
        resolve(false);
      });
    });
  } catch {
    return false;
  }
}

export async function pingKaffeiner(
  type: 'website' | 'database',
  dbType: 'sql' | 'mongodb' | undefined,
  uri: string,
  collectionOrTable?: string,
): Promise<boolean> {
  if (type === 'website') {
    return pingWebsite(uri);
  }

  if (type === 'database') {
    if (dbType === 'mongodb') {
      return pingMongoDB(uri, collectionOrTable);
    }
    if (dbType === 'sql') {
      return pingSQL(uri, collectionOrTable);
    }
  }

  return false;
}
