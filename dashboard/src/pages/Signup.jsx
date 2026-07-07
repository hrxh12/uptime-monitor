// signup page — ab ASLI auth: backend par account banta hai, token milta hai
import { useState } from 'react';
// Link = navigate karne wala <a>, useNavigate = code se page badalne ka hook
import { Link, useNavigate } from 'react-router-dom';

import { signup, saveToken, saveUser } from '../services/api';

// signup page (/signup) — dark background par centered card
function Signup() {
  // form fields ke dabbe
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // navigate() bolo aur user dusre page par chala jaye
  const navigate = useNavigate();

  // submit par: backend ko bhejo, token bachao, TAB dashboard
  // async zaroori hai — andar await hai (async ke bina syntax error)
  async function handleSubmit(e) {
    e.preventDefault(); // page reload rok do
    // dono password same? frontend par hi pakdo
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const data = await signup(name, email, password);
      saveToken(data.token);  // token sambhalo — yehi login ka saboot hai
      saveUser(data.user);    // naam bhi sambhalo — navbar mein dikhega
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);  // jaise "Email already registered"
      setSaving(false);       // button wapas enable — dobara try kar sake
    }
  }

  // har input ki same styling — ek variable mein rakh lo
  const inputClass =
    'w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600';

  return (
    // poori screen — card ko beech mein rakho (flex + items-center + justify-center)
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col items-center justify-center px-4 py-12">
      {/* upar chhota logo — click karke home wapas */}
      <Link to="/" className="flex items-center gap-2.5 mb-8">
        <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
        <span className="text-lg font-semibold text-white">Sentinel</span>
      </Link>

      {/* card */}
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
        <h1 className="text-xl font-semibold text-white mb-1">Create your account</h1>
        <p className="text-sm text-neutral-500 mb-6">Start monitoring in under a minute.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* naam */}
          <div>
            <label className="block text-sm text-neutral-400 mb-1.5">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Harsh Singh"
              className={inputClass}
            />
          </div>

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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          {/* confirm password */}
          <div>
            <label className="block text-sm text-neutral-400 mb-1.5">Confirm password</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {saving ? 'Creating…' : 'Create account'}
          </button>
        </form>

        {/* login page ka link */}
        <p className="text-sm text-neutral-500 mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

// bahar bhejo taaki router use kar sake
export default Signup;
