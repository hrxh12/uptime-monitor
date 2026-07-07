// chhota gol dot jo status ka rang dikhata hai (up=green, down=red, warna grey)
// props: status ('up' | 'down' | 'unknown'), pulse (true ho to dot dhadakta hai)
function StatusDot({ status, pulse = false }) {
  // status ke hisaab se rang chuno
  const color =
    status === 'up' ? 'bg-green-500' : status === 'down' ? 'bg-red-500' : 'bg-neutral-500';

  return (
    // relative wrapper — taaki pulse wala ring dot ke upar baith sake
    <span className="relative flex w-2.5 h-2.5">
      {/* pulse=true ho to peeche ek failta hua ring (animate-ping) */}
      {pulse && (
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${color} animate-ping opacity-75`}
        ></span>
      )}
      {/* asli dot */}
      <span className={`relative inline-flex w-2.5 h-2.5 rounded-full ${color}`}></span>
    </span>
  );
}

// bahar bhejo taaki dusre components use kar saken
export default StatusDot;
