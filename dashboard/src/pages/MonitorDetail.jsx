// useState + useEffect — data laane ka wahi pattern
import { useState, useEffect } from 'react';
// useParams = URL se :id nikaalne ka hook, useNavigate = delete ke baad wapas bhejne ke liye
import { useParams, Link, useNavigate } from 'react-router-dom';
// apne components
import Navbar from '../components/Navbar';
import StatusDot from '../components/StatusDot';
import ResponseChart from '../components/ResponseChart';
import IncidentList from '../components/IncidentList';
// backend calls
import { getMonitors, getUptime, getChecks, getIncidents, deleteMonitor } from '../services/api';

// uptime number ko "99.98%" banao, null ho to "—" (matlab abhi data nahi)
function formatUptime(value) {
  return value == null ? '—' : `${value.toFixed(2)}%`;
}

// monitor detail page (/monitor/:id) — ek monitor ki poori kahani
function MonitorDetail() {
  // URL se monitor ki id nikaalo
  const { id } = useParams();

  // is page ke saare data ke dabbe
  const [monitor, setMonitor] = useState(null);     // monitor ka naam/url/status
  const [uptime, setUptime] = useState(null);       // { uptime24h, uptime7d, uptime30d }
  const [checks, setChecks] = useState([]);         // last 50 checks (chart ke liye)
  const [incidents, setIncidents] = useState([]);   // incidents ki list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // delete request chal rahi hai? (button disable karne ke liye)
  const [deleting, setDeleting] = useState(false);
  // delete ke baad dashboard par wapas bhejne ke liye
  const navigate = useNavigate();

  // delete button dabane par
  async function handleDelete() {
    // galti se click se bachao — browser ka built-in confirm box
    const sure = window.confirm(
      `Delete "${monitor.name}"? Its checks and incidents will also be removed.`
    );
    if (!sure) return;
    setDeleting(true);
    try {
      await deleteMonitor(id);
      navigate('/dashboard'); // ho gaya — list par wapas
    } catch (err) {
      console.log('Delete error:', err);
      setError('Could not delete monitor.');
      setDeleting(false);
    }
  }

  // page khulte hi sab kuch laao
  useEffect(() => {
    async function loadAll() {
      try {
        // Promise.all = chaaron calls EK SAATH bhejo (ek ke baad ek se tez)
        // (backend par /monitors/:id nahi hai, isliye list laakar apna wala dhundhte hain)
        const [allMonitors, uptimeData, checksData, incidentsData] = await Promise.all([
          getMonitors(),
          getUptime(id),
          getChecks(id),
          getIncidents(id),
        ]);
        // list mein se apni id wala monitor dhundo
        setMonitor(allMonitors.find((m) => m._id === id) || null);
        setUptime(uptimeData);
        setChecks(checksData);
        setIncidents(incidentsData);
      } catch (err) {
        console.log('Error:', err);
        setError('Could not load monitor data. Is the backend running on port 4000?');
      } finally {
        setLoading(false);
      }
    }
    loadAll();

    // har 30s mein fresh data — status, chart, incidents live rahenge
    const timer = setInterval(loadAll, 30000);
    // page chhodte waqt timer band (cleanup)
    return () => clearInterval(timer);
  }, [id]); // id badle to sab dobara laao

  // uptime ke 3 stat boxes ka data — map karke banayenge (3 baar same JSX nahi)
  const uptimeStats = [
    { label: 'Last 24 hours', value: uptime?.uptime24h },
    { label: 'Last 7 days', value: uptime?.uptime7d },
    { label: 'Last 30 days', value: uptime?.uptime30d },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      {/* navbar — right mein dashboard par wapas jaane ka link */}
      <Navbar>
        <Link to="/dashboard" className="text-sm text-neutral-400 hover:text-white transition-colors">
          ← All monitors
        </Link>
      </Navbar>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* loading / error states pehle handle karo */}
        {loading && <p className="text-neutral-500">Loading...</p>}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}
        {/* loading khatam, error nahi, par monitor hi nahi mila (galat id?) */}
        {!loading && !error && !monitor && (
          <p className="text-neutral-500">Monitor not found.</p>
        )}

        {/* monitor mil gaya — asli content */}
        {!loading && !error && monitor && (
          <>
            {/* HEADER: dot + naam + status left, delete button right, neeche url */}
            <div className="mb-8">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                <StatusDot status={monitor.status} pulse={monitor.status === 'up'} />
                <h1 className="text-2xl font-bold text-white">{monitor.name}</h1>
                <span
                  className={`text-xs font-medium uppercase tracking-wider rounded px-2 py-1 border ${
                    monitor.status === 'up'
                      ? 'text-green-500 bg-green-500/10 border-green-500/20'
                      : monitor.status === 'down'
                      ? 'text-red-500 bg-red-500/10 border-red-500/20'
                      : 'text-neutral-400 bg-neutral-500/10 border-neutral-500/20'
                  }`}
                >
                  {monitor.status}
                </span>
                </div>
                {/* delete — laal outline, hover par bhara hua. deleting ke waqt disabled */}
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-sm text-red-500 border border-red-500/30 rounded-lg px-3.5 py-1.5 hover:bg-red-500/10 hover:border-red-500/50 transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
              {/* url — click karke asli site khol sakte ho */}
              <a
                href={monitor.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-neutral-400 hover:text-white transition-colors mt-2 inline-block ml-5.5"
              >
                {monitor.url} ↗
              </a>
            </div>

            {/* UPTIME — 3 stat boxes ek row mein */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {uptimeStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-5"
                >
                  <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
                    {stat.label}
                  </div>
                  <div className="text-2xl font-semibold text-white tabular-nums">
                    {formatUptime(stat.value)}
                  </div>
                </div>
              ))}
            </div>

            {/* RESPONSE TIME CHART */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 mb-8">
              <h2 className="font-semibold text-white mb-1">Response time</h2>
              <p className="text-xs text-neutral-500 mb-4">Last {checks.length} checks · milliseconds</p>
              {/* checks hi nahi to chart ki jagah message */}
              {checks.length === 0 ? (
                <p className="text-sm text-neutral-500 py-10 text-center">No checks yet.</p>
              ) : (
                <ResponseChart checks={checks} />
              )}
            </div>

            {/* INCIDENTS */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
              <h2 className="font-semibold text-white mb-1">Incidents</h2>
              <p className="text-xs text-neutral-500 mb-2">Times this monitor went down</p>
              <IncidentList incidents={incidents} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// bahar bhejo taaki router use kar sake
export default MonitorDetail;
