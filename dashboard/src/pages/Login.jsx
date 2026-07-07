// login page — ab ASLI auth: backend se token milta hai
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// login = backend call, saveToken = token localStorage mein bachao
import { login, saveToken, saveUser } from '../services/api';

// login page (/login) — dark background par centered card
function Login() {
  // form fields ke dabbe
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // backend se error aayi to yahan (jaise "Invalid email or password")
  const [error, setError] = useState('');
  // request chal rahi hai? (button disable karne ke liye)
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // submit par: backend se token lo, bachao, TAB dashboard
  async function handleSubmit(e) {
    e.preventDefault(); // page reload rok do
    setSaving(true);
    setError('');
    try {
      const data = await login(email, password);
      saveToken(data.token);  // token sambhalo — yehi login ka saboot hai
      saveUser(data.user);    // naam bhi sambhalo — navbar mein dikhega
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);  // jaise "Invalid email or password"
      setSaving(false);       // button wapas enable — dobara try kar sake
    }
  }

  const inputClass =
    'w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600';

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col items-center justify-center px-4 py-12">
      {/* upar chhota logo — click karke home wapas */}
      <Link to="/" className="flex items-center gap-2.5 mb-8">
        <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
        <span className="text-lg font-semibold text-white">Sentinel</span>
      </Link>

      {/* card */}
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
        <h1 className="text-xl font-semibold text-white mb-1">Welcome back</h1>
        <p className="text-sm text-neutral-500 mb-6">Log in to your dashboard.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* email */}
          <div>
            <label className="block text-sm text-neutral-400 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          {/* password */}
          <div>
            <label className="block text-sm text-neutral-400 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          {/* error message (agar ho) */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* submit — saving ke waqt disable + text badlo */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-white text-neutral-950 font-semibold rounded-lg py-2.5 text-sm hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {saving ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        {/* signup page ka link */}
        <p className="text-sm text-neutral-500 mt-6 text-center">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-white hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

// bahar bhejo taaki router use kar sake
export default Login;
