import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const chartData = [
  { time: '00:00', uptime: 100, latency: 12 },
  { time: '01:00', uptime: 99.9, latency: 14 },
  { time: '02:00', uptime: 100, latency: 11 },
  { time: '03:00', uptime: 99.8, latency: 18 },
  { time: '04:00', uptime: 100, latency: 10 },
  { time: '05:00', uptime: 99.95, latency: 13 },
  { time: '06:00', uptime: 100, latency: 9 },
  { time: '07:00', uptime: 99.9, latency: 15 },
  { time: '08:00', uptime: 100, latency: 11 },
  { time: '09:00', uptime: 99.85, latency: 22 },
  { time: '10:00', uptime: 100, latency: 12 },
  { time: '11:00', uptime: 100, latency: 10 },
];

interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadEntry[]; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border border-border bg-card/95 backdrop-blur-sm px-3 py-2 shadow-xl text-xs">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((entry, i: number) => (
        <p key={i} className="font-medium text-foreground" style={{ color: entry.color }}>
          {entry.name === 'uptime' ? `Uptime: ${Number(entry.value).toFixed(2)}%` : `Latency: ${entry.value}ms`}
        </p>
      ))}
    </div>
  );
}

export default function DashboardChart() {
  return (
    <div className="rounded-xl border border-border/40 bg-muted/10 p-2">
      <div className="flex items-center justify-between mb-1 px-1">
        <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">Uptime (24h)</span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[8px] text-success">
            <span className="size-1.5 rounded-full bg-success" />
            99.97%
          </span>
          <span className="flex items-center gap-1 text-[8px] text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            12ms avg
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={60}>
        <AreaChart data={chartData} margin={{ top: 2, right: 2, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--success)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="var(--success)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: 'var(--muted-foreground)' }} interval={3} />
          <YAxis hide domain={[99.5, 100.5]} />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Area
            type="monotone"
            dataKey="uptime"
            stroke="var(--primary)"
            strokeWidth={1.5}
            fill="url(#uptimeGradient)"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="latency"
            stroke="var(--success)"
            strokeWidth={1.5}
            fill="url(#latencyGradient)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
