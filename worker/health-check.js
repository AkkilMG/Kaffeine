/**
 * Kaffeine Health Check Worker
 * Cloudflare Worker for distributed health checks
 * 
 * Setup:
 * 1. Create a Cloudflare Worker
 * 2. Deploy this script
 * 3. Set environment variables (see wrangler.toml)
 */ // 4. Configure cron trigger: "*/5 * * * *" (every 5 minutes)
 /*   This supports the minimum 5-minute check interval.
 *    The worker filters kaffeiners by their individual check_interval
 *    and only triggers checks for those whose interval has elapsed.
 * 
 * Supported check intervals per kaffeiner:
 *   5 min, 30 min, 1 hr (60), 3 hr (180), 6 hr (360), 12 hr (720), 24 hr (1440)
 **/

// interface KaffeinerFromAPI {
//   _id: string;
//   type: 'website' | 'database';
//   db_type?: 'sql' | 'mongodb';
//   check_interval: number; // minutes
//   recentKaffeiner: string | null; // ISO date string
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

/**
 * Determine whether a kaffeiner's check interval has elapsed
 * and it should be checked now.
 * 
 * @param {number} intervalMinutes - The kaffeiner's check interval in minutes
 * @param {string|null} recentKaffeiner - ISO date string of last check, or null
 * @returns {boolean} true if enough time has passed to warrant a new check
 */
function shouldCheckNow(intervalMinutes, recentKaffeiner) {
  // If never checked, always check
  if (!recentKaffeiner) return true;

  const lastCheck = new Date(recentKaffeiner).getTime();
  const now = Date.now();
  const intervalMs = intervalMinutes * 60 * 1000;

  return (now - lastCheck) >= intervalMs;
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

      // Fetch kaffeiners from API (includes check_interval and recentKaffeiner)
      const response = await fetch(`${KAFFEINE_API_URL}/api/kaffeiners`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch kaffeiners: ${response.status}`);
      }

      const allKaffeiners = await response.json();
      console.log(`[Worker] Found ${allKaffeiners.length} total kaffeiners`);

      // Filter to only those whose check interval has elapsed
      const kaffeinersToCheck = allKaffeiners.filter((k) =>
        shouldCheckNow(k.check_interval || 60, k.recentKaffeiner)
      );

      console.log(`[Worker] ${kaffeinersToCheck.length} kaffeiners due for check`);

      if (kaffeinersToCheck.length === 0) {
        console.log('[Worker] No kaffeiners due for check. Exiting.');
        return;
      }

      // Perform health checks in parallel with max concurrency
      const maxConcurrency = 5;
      const chunks = [];

      for (let i = 0; i < kaffeinersToCheck.length; i += maxConcurrency) {
        chunks.push(kaffeinersToCheck.slice(i, i + maxConcurrency));
      }

      let submitted = 0;
      let failed = 0;
      let skipped = 0;

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

      skipped = allKaffeiners.length - kaffeinersToCheck.length;
      console.log(
        `[Worker] Completed: ${submitted} submitted, ${failed} failed, ${skipped} skipped (interval not elapsed)`
      );
    } catch (error) {
      console.error('[Worker] Error during health checks:', error);
    }
  },
};
