// incidents ki timeline (list) — har incident ek row
// props: incidents = [{ startedAt, resolvedAt, durationMs, cause }]

// milliseconds ko "2h 5m" ya "3m 20s" jaisa padhne-layak text banao
function formatDuration(ms) {
  if (ms == null) return null; // duration hi nahi to kuch nahi
  const totalSeconds = Math.round(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function IncidentList({ incidents }) {
  // koi incident nahi — achhi baat hai! khaali state dikhao
  if (incidents.length === 0) {
    return (
      <p className="text-sm text-neutral-500 py-6 text-center">
        No incidents yet. Smooth sailing 🎉
      </p>
    );
  }

  return (
    // divide-y = har row ke beech halki line
    <ul className="divide-y divide-neutral-800">
      {incidents.map((incident, index) => {
        // resolvedAt null = incident abhi bhi chal raha hai
        const ongoing = incident.resolvedAt == null;
        return (
          <li key={index} className="flex items-start gap-3 py-4">
            {/* timeline dot — chal raha ho to red, khatam ho gaya to grey */}
            <span
              className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                ongoing ? 'bg-red-500' : 'bg-neutral-600'
              }`}
            ></span>

            <div className="min-w-0">
              {/* pehli line: cause + (ongoing ho to laal badge) */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-white">{incident.cause}</span>
                {ongoing && (
                  <span className="text-[11px] font-medium uppercase tracking-wider text-red-500 bg-red-500/10 border border-red-500/20 rounded px-1.5 py-0.5">
                    Ongoing
                  </span>
                )}
              </div>
              {/* dusri line: kab shuru hua + kitni der chala */}
              <div className="text-xs text-neutral-500 mt-1">
                Started {new Date(incident.startedAt).toLocaleString()}
                {/* duration tabhi dikhao jab hai */}
                {incident.durationMs != null && <> · lasted {formatDuration(incident.durationMs)}</>}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// bahar bhejo taaki MonitorDetail use kar sake
export default IncidentList;
