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

const KAFFEINE_API_URL = 'https://kaffeine.arkynox.com';


async function generateToken(env) {
  const combinedKey = `${env.CF_API_TOKEN}:${env.CF_WORKER_SECRET}`;

  const response = await fetch(`${KAFFEINE_API_URL}/api/cf/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ key: combinedKey }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate token');
  }

  const data = await response.json();
  return data.token;
}

async function performHealthCheck(
  kaffeiner
) {
  // The API performs its own ping server-side via POST /api/cf/kaffeiner
  // The worker's role is to trigger the check by submitting the kaffeiner ID
  return { kaffeinerId: kaffeiner._id };
}

async function submitHealthCheck(
  kaffeinerId, token
) {
  try {
    const response = await fetch(`${KAFFEINE_API_URL}/api/cf/kaffeiner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ kaffeiner_id: kaffeinerId }),
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
      const response = await fetch(`${KAFFEINE_API_URL}/api/kaffeiners`, {
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
          chunk.map((kaffeiner) => performHealthCheck(kaffeiner))
        );

        for (const check of checks) {
          const success = await submitHealthCheck(check.kaffeinerId, token);
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
