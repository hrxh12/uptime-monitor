// useState (data ka dabba) + useEffect (component dikhte hi karo)
import { useState, useEffect } from 'react';
// card click hone par detail page kholne ke liye
import { Link } from 'react-router-dom';
// status wala dot
import StatusDot from './StatusDot';
// is monitor ka uptime laane ke liye
import { getUptime } from '../services/api';

// ek monitor ka card (dashboard ke grid mein dikhta hai)
// props: monitor = poora monitor object ({ _id, name, url, status, ... })
function MonitorCard({ monitor }) {
  // 24h uptime rakhne ka dabba. shuru mein null (= abhi pata nahi / data hi nahi)
  const [uptime24h, setUptime24h] = useState(null);

  // card dikhte hi is monitor ka uptime backend se laao
  useEffect(() => {
    getUptime(monitor._id)
      .then((data) => setUptime24h(data.uptime24h)) // sirf 24h wala number chahiye yahan
      .catch((err) => console.log('Uptime error:', err));
  }, [monitor]); // Dashboard har 30s naya monitor object bhejta hai — tab uptime bhi taaza karo

  return (
    // poora card ek Link hai — click karo to /monitor/:id khule
    // hover par border thoda halka — subtle feedback
    <Link
      to={`/monitor/${monitor._id}`}
      className="block bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 hover:bg-neutral-900/60 transition-colors"
    >
      {/* upar ki line: dot + naam left, status text right */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* status dot — up ho to dhadakta hua */}
          <StatusDot status={monitor.status} pulse={monitor.status === 'up'} />
          {/* naam — truncate = lamba ho to ... laga do */}
          <span className="font-semibold text-white truncate">{monitor.name}</span>
        </div>
        {/* status text — rang bhi status ke hisaab se */}
        <span
          className={`text-xs font-medium uppercase tracking-wider ${
            monitor.status === 'up'
              ? 'text-green-500'
              : monitor.status === 'down'
              ? 'text-red-500'
              : 'text-neutral-500'
          }`}
        >
          {monitor.status}
        </span>
      </div>

      {/* url — halka grey, truncate */}
      <div className="mt-1.5 ml-5.5 text-sm text-neutral-400 truncate">{monitor.url}</div>

      {/* neeche: 24h uptime. null ho to "—" dikhao (abhi data nahi hai) */}
      <div className="mt-4 ml-5.5 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-white tabular-nums">
          {uptime24h == null ? '—' : `${uptime24h.toFixed(2)}%`}
        </span>
        <span className="text-xs text-neutral-500">uptime · 24h</span>
      </div>
    </Link>
  );
}

// bahar bhejo taaki Dashboard use kar sake
export default MonitorCard;
