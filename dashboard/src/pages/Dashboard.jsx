// useState (data ke dabbe) + useEffect (page khulte hi karo)
import { useState, useEffect } from 'react';
// logout ke baad landing par bhejne ke liye
import { useNavigate } from 'react-router-dom';
// apne components
import Navbar from '../components/Navbar';
import MonitorCard from '../components/MonitorCard';
import AddMonitorModal from '../components/AddMonitorModal';
// getMonitors = list laao, clearToken = logout, getUser = navbar mein naam ke liye
import { getMonitors, clearToken, getUser } from '../services/api';

// dashboard page (/dashboard) — asli backend se monitors dikhata hai
function Dashboard() {
  // monitors ki list. shuru mein khaali.
  const [monitors, setMonitors] = useState([]);
  // pehli baar data aane tak "Loading..." dikhane ke liye
  const [loading, setLoading] = useState(true);
  // Add Monitor modal khula hai ya nahi
  const [showModal, setShowModal] = useState(false);
  // backend na chale to error dikhane ke liye
  const [error, setError] = useState('');
  // refresh ka trick: yeh number badlo to neeche wala useEffect dobara chalta hai
  // (naya monitor add hone ke baad list dobara laane ke liye)
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  // login ke waqt bachaya hua user (naam navbar mein dikhana hai)
  const user = getUser();

  // page khulte hi chalao, aur jab bhi refreshKey badle tab bhi
  useEffect(() => {
    // monitors backend se laane wala function (effect ke andar hi banaya)
    async function loadMonitors() {
      try {
        const data = await getMonitors();
        setMonitors(data);
        setError('');
      } catch (err) {
        console.log('Error:', err);
        setError('Could not load monitors. Is the backend running on port 4000?');
      } finally {
        // finally = success ho ya error, loading khatam
        setLoading(false);
      }
    }
    loadMonitors();

    // har 30s mein dobara laao — status/uptime bina refresh ke live update honge
    const timer = setInterval(loadMonitors, 30000);
    // cleanup: useEffect se return kiya function tab chalta hai jab component hatta hai
    // — timer band karo, warna page chhodne ke baad bhi chalta rahega (memory leak)
    return () => clearInterval(timer);
  }, [refreshKey]); // refreshKey badla = dobara chalao

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200">
      {/* navbar — right mein greeting + logout button */}
      <Navbar>
        {/* kaunsa user login hai — naam dikhao (user na mile to kuch mat dikhao) */}
        {user && (
          <span className="text-sm text-neutral-400">
            Hello, <span className="text-white font-medium">{user.name}</span>
          </span>
        )}
        <button
          onClick={() => {
            clearToken();   // token phenko — ab user "logged out" hai
            navigate('/');  // landing par wapas
          }}
          className="text-sm text-neutral-400 hover:text-white transition-colors"
        >
          Log out
        </button>
      </Navbar>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* header row: heading left, Add Monitor button right */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Monitors</h1>
            {/* kitne monitors hain — chhota sa count */}
            <p className="text-sm text-neutral-500 mt-1">
              {monitors.length} monitor{monitors.length !== 1 && 's'}
            </p>
          </div>
          {/* button dabao to modal khule */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-neutral-950 font-semibold rounded-lg px-4 py-2.5 text-sm hover:bg-neutral-200 transition-colors"
          >
            + Add Monitor
          </button>
        </div>

        {/* error state — backend nahi chal raha waghera */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* loading state */}
        {loading && <p className="text-neutral-500">Loading...</p>}

        {/* empty state — loading khatam, error nahi, par monitors zero */}
        {!loading && !error && monitors.length === 0 && (
          <div className="border border-dashed border-neutral-800 rounded-xl py-16 text-center">
            <p className="text-neutral-400 mb-1">No monitors yet</p>
            <p className="text-sm text-neutral-600">
              Add your first monitor to start tracking uptime.
            </p>
          </div>
        )}

        {/* monitors ka grid — mobile 1, tablet 2, desktop 3 columns */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {monitors.map((monitor) => (
            // har monitor ka apna card (card khud apna uptime laata hai)
            <MonitorCard key={monitor._id} monitor={monitor} />
          ))}
        </div>
      </div>

      {/* modal — sirf tab dikhao jab showModal true ho */}
      {showModal && (
        <AddMonitorModal
          onClose={() => setShowModal(false)}                // band karne par
          onAdded={() => setRefreshKey((k) => k + 1)}        // number badlo → effect dobara → list refresh
        />
      )}
    </div>
  );
}

// bahar bhejo taaki router use kar sake
export default Dashboard;
