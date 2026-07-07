// useState — form ke har field ka data rakhne ke liye
import { useState } from 'react';
// naya monitor backend par bhejne ke liye
import { addMonitor } from '../services/api';

// modal = poori screen par dark parda + beech mein form card
// props: onClose = modal band karo, onAdded = monitor ban gaya, list refresh karo
function AddMonitorModal({ onClose, onAdded }) {
  // har input ka apna dabba
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [intervalSeconds, setIntervalSeconds] = useState(60);
  const [alertEmail, setAlertEmail] = useState('');
  // submit chal raha hai? (button disable karne ke liye, double-click se bachao)
  const [saving, setSaving] = useState(false);
  // koi error aayi to yahan message rakho
  const [error, setError] = useState('');

  // form submit hone par — backend ko POST bhejo
  async function handleSubmit(e) {
    e.preventDefault(); // page reload mat karo (form ka default kaam rok do)
    setSaving(true);
    setError('');
    try {
      // Number(...) — input hamesha string deta hai, backend ko number chahiye
      await addMonitor({ name, url, intervalSeconds: Number(intervalSeconds), alertEmail });
      onAdded();  // parent (Dashboard) ko bolo: ban gaya, list dobara laao
      onClose();  // modal band karo
    } catch (err) {
      console.log('Add monitor error:', err);
      setError('Could not add monitor. Is the backend running?');
      setSaving(false); // button wapas enable karo taaki dobara try kar saken
    }
  }

  // ek input ki styling baar-baar na likhni pade isliye ek variable mein
  const inputClass =
    'w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600';

  return (
    // parda — fixed inset-0 = poori screen dhak lo. parde par click = band
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      {/* card — stopPropagation = card ke andar click parde tak na pahunche (warna band ho jayega) */}
      <div
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header: title left, band karne ka ✕ right */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Add Monitor</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* form — space-y-4 = fields ke beech gap */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* naam */}
          <div>
            <label className="block text-sm text-neutral-400 mb-1.5">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Website"
              className={inputClass}
            />
          </div>

          {/* url */}
          <div>
            <label className="block text-sm text-neutral-400 mb-1.5">URL</label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className={inputClass}
            />
          </div>

          {/* check interval (seconds) */}
          <div>
            <label className="block text-sm text-neutral-400 mb-1.5">Check interval (seconds)</label>
            <input
              type="number"
              required
              min="10"
              value={intervalSeconds}
              onChange={(e) => setIntervalSeconds(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* alert email */}
          <div>
            <label className="block text-sm text-neutral-400 mb-1.5">Alert email</label>
            <input
              type="email"
              required
              value={alertEmail}
              onChange={(e) => setAlertEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          {/* error message (agar ho) */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* submit button — saving ke waqt disable + text badlo */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-white text-neutral-950 font-semibold rounded-lg py-2.5 text-sm hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {saving ? 'Adding…' : 'Add Monitor'}
          </button>
        </form>
      </div>
    </div>
  );
}

// bahar bhejo taaki Dashboard use kar sake
export default AddMonitorModal;
