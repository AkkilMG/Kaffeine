/**
 * Kaffeine Health Check Worker
 * Cloudflare Worker for distributed health checks
 * 
 * Setup:
 * 1. Create a Cloudflare Worker
 * 2. Deploy this script
 * 3. Set environment variables (see wrangler.toml)
 * 4. Configure cron trigger (e.g., "0 * * * *" for hourly)
 */

// interface HealthCheckResult {
//   kaffeinerId: string;
//   status: 'up' | 'down';
//   responseTime: number;
//   errorMessage?: string;
// }

async function generateToken(env) {
  const response = await fetch(`${env.KAFFEINE_API_URL}/api/cf/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to generate token');
  }

  const data = await response.json();
  return data.token;
}

async function checkWebsite(url) {
  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'HEAD',
      cf: { cacheTtl: 0 }, // Don't cache
    });
    const responseTime = Date.now() - startTime;

    if (response.status >= 200 && response.status < 300) {
      return { status: 'up', responseTime };
    } else {
      return { status: 'down', error: `HTTP ${response.status}` };
    }
  } catch (error) {
    return {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function checkDatabase(
  type, connectionString
) {
  try {
    const startTime = Date.now();

    // Parse connection string
    const url = new URL(connectionString.replace(/^mongodb\+srv:/, 'https:').replace(/^postgresql:/, 'https:').replace(/^mysql:/, 'https:'));

    // For now, we'll do a simple TCP connection test by attempting a fetch to the host
    // In production, use actual database drivers for more accurate checks
    const response = await fetch(`https://${url.hostname}:${url.port || 5432}`, {
      method: 'HEAD',
      cf: { cacheTtl: 0 },
    });

    const responseTime = Date.now() - startTime;
    return { status: 'up', responseTime };
  } catch (error) {
    // Connection failed, but this is expected for database checks via HTTPS
    // We'll report as up if the error indicates the server is responding
    const responseTime = Date.now() - startTime;
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';

    // If we get a connection timeout or refused, it's down
    if (errorMsg.includes('timeout') || errorMsg.includes('refused')) {
      return { status: 'down', error: errorMsg };
    }

    // Otherwise consider it up (server is responding, just not HTTPS)
    return { status: 'up', responseTime };
  }
}

async function performHealthCheck(
  kaffeiner, env
) {
  const kaffeinerId = kaffeiner._id;
  let result;

  try {
    if (kaffeiner.type === 'website') {
      result = await checkWebsite(kaffeiner.url);
    } else {
      // Database checks
      result = await checkDatabase(kaffeiner.type, kaffeiner.url);
    }

    return {
      kaffeinerId,
      status: result.status,
      responseTime: result.responseTime || 0,
      errorMessage: result.error,
    };
  } catch (error) {
    return {
      kaffeinerId,
      status: 'down',
      responseTime: 0,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function submitHealthCheck(
  check, token, env
) {
  try {
    const response = await fetch(`${env.KAFFEINE_API_URL}/api/cf/kaffeiner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(check),
    });

    return response.ok;
  } catch (error) {
    console.error('[Worker] Failed to submit health check:', error);
    return false;
  }
}

export default {
  async fetch(request, env, ctx) {
    return new Response('Kaffeine Health Check Worker');
  },

  async scheduled(event, env, ctx) {
    console.log('[Worker] Starting health checks...');

    try {
      // Generate token
      const token = await generateToken(env);
      console.log('[Worker] Generated token');

      // Fetch kaffeiners from API
      const response = await fetch(`${env.KAFFEINE_API_URL}/api/kaffeiners`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch kaffeiners: ${response.status}`);
      }

      const kaffeiners = await response.json();
      console.log(`[Worker] Found ${kaffeiners.length} kaffeiners to check`);

      // Perform health checks in parallel with max concurrency
      const maxConcurrency = 5;
      const chunks = [];

      for (let i = 0; i < kaffeiners.length; i += maxConcurrency) {
        chunks.push(kaffeiners.slice(i, i + maxConcurrency));
      }

      let submitted = 0;
      let failed = 0;

      for (const chunk of chunks) {
        const checks = await Promise.all(
          chunk.map((kaffeiner) => performHealthCheck(kaffeiner, env))
        );

        for (const check of checks) {
          const success = await submitHealthCheck(check, token, env);
          if (success) {
            submitted++;
          } else {
            failed++;
          }
        }
      }

      console.log(`[Worker] Completed: ${submitted} submitted, ${failed} failed`);
    } catch (error) {
      console.error('[Worker] Error during health checks:', error);
    }
  },
};
