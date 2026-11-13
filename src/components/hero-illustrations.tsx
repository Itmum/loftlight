/**
 * Geometric artwork for the hero slider slides. Each fills its parent
 * (which must be `relative` and `overflow-hidden`) edge to edge and uses
 * fixed brand-artwork colors so it renders identically in both themes.
 */

export function HouseIllustration() {
  return (
    <div className="absolute inset-0 bg-[#d9c8bb]">
      <svg
        viewBox="0 0 420 380"
        preserveAspectRatio="xMidYMax meet"
        className="absolute bottom-0 left-1/2 h-[86%] -translate-x-1/2"
        aria-hidden="true"
      >
        <polygon points="210,10 20,160 400,160" fill="#7a4231" />
        <rect x="20" y="160" width="380" height="220" fill="#e0a93b" />
      </svg>
    </div>
  );
}

export function MicIllustration() {
  return (
    <div className="absolute inset-0 bg-[#f2e2c2]">
      <svg
        viewBox="0 0 420 380"
        preserveAspectRatio="xMidYMax meet"
        className="absolute bottom-0 left-1/2 h-[92%] -translate-x-1/2"
        aria-hidden="true"
      >
        <rect x="170" y="40" width="80" height="180" rx="40" fill="#e0a93b" />
        <path
          d="M110 170 v40 a100 100 0 0 0 200 0 v-40"
          fill="none"
          stroke="#2a211b"
          strokeWidth="26"
          strokeLinecap="round"
        />
        <line
          x1="210"
          y1="310"
          x2="210"
          y2="370"
          stroke="#2a211b"
          strokeWidth="26"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function RoomIllustration() {
  return (
    <div className="absolute inset-0 bg-[#e8dcc6]">
      <span className="absolute top-[14%] right-[10%] aspect-square w-[30%] max-w-52 rounded-full bg-sage" />
      <svg
        viewBox="0 0 400 140"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[32%] w-full"
        aria-hidden="true"
      >
        <path d="M0 140 C 90 10, 310 10, 400 140 Z" fill="#c8553d" />
      </svg>
    </div>
  );
}
