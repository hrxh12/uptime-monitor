// Link = <a> jaisa par bina page reload ke
import { Link } from 'react-router-dom';
// upar wala navbar (right side ka content hum children mein bhejte hain)
import Navbar from '../components/Navbar';

// landing page ke 3 features — data alag rakha taaki JSX saaf rahe
// icon = simple emoji (koi icon library nahi chahiye)
const FEATURES = [
  {
    icon: '🌍',
    title: 'Distributed checking',
    text: 'Every check runs from multiple independent workers, so one slow region never decides your fate.',
  },
  {
    icon: '🔕',
    title: 'No false alarms',
    text: 'A site is only marked down when checks agree. Flapping detection keeps 3am pages honest.',
  },
  {
    icon: '📈',
    title: 'Real uptime SLAs',
    text: 'True 24h / 7d / 30d uptime computed from raw checks — not marketing-friendly rounding.',
  },
];

// landing page (/) — marketing hero. static hai, koi backend call nahi.
function Landing() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col">
      {/* navbar — right side mein nav links + login/signup */}
      <Navbar>
        {/* nav links — chhoti screen par chhupa do (hidden md:flex) */}
        <div className="hidden md:flex items-center gap-6 text-sm text-neutral-400">
          <a href="#product" className="hover:text-white transition-colors">Product</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#docs" className="hover:text-white transition-colors">Docs</a>
        </div>
        {/* login link + signup button */}
        <Link to="/login" className="text-sm text-neutral-400 hover:text-white transition-colors px-2">
          Log in
        </Link>
        <Link
          to="/signup"
          className="text-sm font-medium bg-white text-neutral-950 rounded-lg px-4 py-2 hover:bg-neutral-200 transition-colors"
        >
          Sign up
        </Link>
      </Navbar>

      {/* HERO — page ka main hissa. flex-1 = bachi jagah le lo */}
      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
          {/* "all systems operational" badge — dhadakta hua hara dot */}
          <div className="inline-flex items-center gap-2 border border-neutral-800 bg-neutral-900 rounded-full px-3.5 py-1.5 text-sm text-neutral-400 mb-8">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 animate-ping opacity-75"></span>
              <span className="relative inline-flex w-2 h-2 rounded-full bg-green-500"></span>
            </span>
            All systems operational
          </div>

          {/* badi headline — display font (Black Ops One), "Monitoring" grey gradient mein */}
          <h1 className="font-['Black_Ops_One'] text-4xl sm:text-5xl md:text-6xl text-white leading-tight">
            Uptime{' '}
            {/* gradient text ka trick: bg gradient + bg-clip-text + text-transparent */}
            <span className="bg-linear-to-b from-neutral-400 to-neutral-600 bg-clip-text text-transparent">
              Monitoring
            </span>{' '}
            Done Right
          </h1>

          {/* subheadline */}
          <p className="mt-6 text-lg text-neutral-400 max-w-2xl mx-auto">
            Distributed checks from independent workers, smart flapping detection, and honest
            uptime numbers. Know your site is down before your users do — with zero false positives.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/signup"
              className="bg-white text-neutral-950 font-semibold rounded-lg px-6 py-3 text-sm hover:bg-neutral-200 transition-colors"
            >
              Get Started
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="border border-neutral-800 text-neutral-300 font-medium rounded-lg px-6 py-3 text-sm hover:border-neutral-600 hover:text-white transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </section>

        {/* FEATURES — 3 cards ek row mein (mobile par ek ke neeche ek) */}
        <section id="features" className="max-w-5xl mx-auto px-6 pb-24">
          <div className="grid md:grid-cols-3 gap-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-colors"
              >
                {/* icon */}
                <div className="text-2xl mb-3">{feature.icon}</div>
                {/* title */}
                <h3 className="font-semibold text-white mb-1.5">{feature.title}</h3>
                {/* description */}
                <p className="text-sm text-neutral-400 leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-neutral-800 px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4 text-sm text-neutral-500">
          {/* left: mini logo */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>Sentinel</span>
          </div>
          {/* right: copyright */}
          <span>© {new Date().getFullYear()} Sentinel. Built as a portfolio project.</span>
        </div>
      </footer>
    </div>
  );
}

// bahar bhejo taaki router use kar sake
export default Landing;
