// recharts se chart ke tukde import — LineChart (poora chart), Line (asli lakeer),
// XAxis/YAxis (neeche/side ke numbers), CartesianGrid (halki lines),
// Tooltip (hover par info box), ResponsiveContainer (parent jitna bada, utna chart)
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// timestamp ko "14:32" jaisa chhota time banao (axis ke liye)
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// hover par dikhne wala apna dark tooltip (recharts ka default white hota hai)
// recharts khud active + payload bhejta hai
function ChartTooltip({ active, payload }) {
  // hover nahi ho raha ya data nahi — kuch mat dikhao
  if (!active || !payload || payload.length === 0) return null;
  // payload[0].payload = us point ka poora check object
  const check = payload[0].payload;
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm shadow-xl">
      {/* time */}
      <div className="text-neutral-400 text-xs mb-1">
        {new Date(check.checkedAt).toLocaleString()}
      </div>
      {/* response time */}
      <div className="text-white font-semibold tabular-nums">{check.responseMs} ms</div>
      {/* status — up/down + code */}
      <div className={`text-xs mt-0.5 ${check.isUp ? 'text-green-500' : 'text-red-500'}`}>
        {check.isUp ? 'Up' : 'Down'} · {check.statusCode}
      </div>
    </div>
  );
}

// response-time ka line chart
// props: checks = last 50 checks ki array [{ statusCode, responseMs, isUp, checkedAt }]
function ResponseChart({ checks }) {
  // chart left→right time ke order mein ho, isliye purane pehle karo
  // [...checks] = copy banao (original array ko mat chhedo)
  const data = [...checks].sort((a, b) => new Date(a.checkedAt) - new Date(b.checkedAt));

  return (
    // ResponsiveContainer ko fixed height chahiye, width parent se le lega
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          {/* sirf horizontal halki lines — vertical lines shor karti hain */}
          <CartesianGrid stroke="#262626" vertical={false} />
          {/* X axis = time. tickLine/axisLine halke rakho, chart hero hai axis nahi */}
          <XAxis
            dataKey="checkedAt"
            tickFormatter={formatTime}
            tick={{ fill: '#737373', fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#404040' }}
            minTickGap={40}
          />
          {/* Y axis = milliseconds */}
          <YAxis
            tick={{ fill: '#737373', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          {/* hover layer — cursor = halki vertical line, content = apna dark box */}
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#404040' }} />
          {/* asli lakeer — patli (2px), har point par dot nahi (shor kam),
              hover wale point par bada dot jiske chaaron or dark ring */}
          <Line
            type="monotone"
            dataKey="responseMs"
            stroke="#3987e5"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#3987e5', stroke: '#171717', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// bahar bhejo taaki MonitorDetail use kar sake
export default ResponseChart;
