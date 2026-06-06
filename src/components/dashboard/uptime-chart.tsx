import { Area, AreaChart, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

function generateChartData(uptime: number) {
  const now = new Date();
  return Array.from({ length: 24 }, (_, i) => {
    const h = (now.getHours() - 23 + i + 24) % 24;
    const variance = (Math.random() - 0.5) * 0.4;
    return {
      time: `${h.toString().padStart(2, '0')}:00`,
      uptime: Math.min(100, Math.max(99, uptime + variance)),
    };
  });
}

interface TooltipPayload {
  value: number;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-card/95 backdrop-blur-sm px-3 py-2 shadow-xl text-xs">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className="font-medium text-foreground">
        Uptime: <span className="text-primary">{Number(payload[0]?.value)?.toFixed(2)}%</span>
      </p>
    </div>
  );
}

export default function UptimeChart({ uptimeValue }: { uptimeValue: number }) {
  const chartData = generateChartData(uptimeValue);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="uptimeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.2} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="time"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
          interval={3}
        />
        <Tooltip content={<CustomTooltip />} cursor={false} />
        <Area
          type="monotone"
          dataKey="uptime"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#uptimeFill)"
          isAnimationActive={false}
          dot={false}
          activeDot={{ r: 4, fill: 'var(--primary)', stroke: 'var(--card)', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
