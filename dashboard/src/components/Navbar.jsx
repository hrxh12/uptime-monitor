// react-router ka Link — <a> jaisa, par page reload nahi karta
import { Link } from 'react-router-dom';

// Navbar ek component hai (ek function jo JSX return karta hai)
// props: children = right side mein jo bhi dikhana ho (har page apna alag bhejta hai)
// isliye ek hi Navbar landing, auth aur dashboard sab jagah kaam karta hai
function Navbar({ children }) {
  return (
    // sticky top-0 = scroll karne par bhi upar chipka rahe
    // backdrop-blur + halka transparent bg = content neeche se dhundhla dikhe (modern look)
    <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-neutral-800 bg-neutral-950/80 backdrop-blur px-6 md:px-8 py-4">
      {/* LEFT: logo — hara dot + app ka naam. click karo to home (/) par jao */}
      <Link to="/" className="flex items-center gap-2.5">
        {/* chhota hara dot */}
        <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
        {/* app ka naam */}
        <span className="text-lg font-semibold text-white tracking-tight">Sentinel</span>
      </Link>

      {/* RIGHT: jo bhi page ne children mein bheja (links, buttons...) */}
      <div className="flex items-center gap-2 md:gap-6">{children}</div>
    </nav>
  );
}

// bahar bhejo taaki pages use kar saken
export default Navbar;
