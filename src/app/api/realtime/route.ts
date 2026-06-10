import { NextRequest } from 'next/server';
import { eventBus } from '@/lib/event-bus';
import { getSessionFromRequest } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const user = getSessionFromRequest(request);

    const userId = user.userId;
    const userRole = user.role;
    const kaffeinerFilter = request.nextUrl.searchParams.get('kaffeinerId');

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        const sendEvent = (data: unknown) => {
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          } catch {
            // Stream closed
          }
        };

        sendEvent({ type: 'connected', message: 'Real-time connection established' });

        const unsubscribe = eventBus.subscribe((event) => {
          if (event.type === 'status-update') {
            if (kaffeinerFilter && event.kaffeinerId !== kaffeinerFilter) return;
            if (userRole !== 'admin' && event.userId !== userId) return;
            sendEvent(event);
          }

          if (event.type === 'kaffeiner-change') {
            if (userRole !== 'admin' && event.userId !== userId) return;
            sendEvent(event);
          }

          if (event.type === 'user-change') {
            if (userRole === 'admin') {
              sendEvent(event);
              return;
            }
            if ((event.action === 'ban' || event.action === 'unban') && event.userId === userId) {
              sendEvent(event);
            }
            return;
          }
        });

        const heartbeat = setInterval(() => {
          sendEvent({ type: 'heartbeat', time: new Date().toISOString() });
        }, 30000);

        request.signal.addEventListener('abort', () => {
          clearInterval(heartbeat);
          unsubscribe();
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch {
    return new Response('Unauthorized', { status: 401 });
  }
}
