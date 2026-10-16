// Decorative fallback for the hero banner (a layered gold bridal necklace on a
// mandala), shown until the owner uploads a real bridal photo from /admin.

const ellipsePoint = (cx, cy, rx, ry, deg) => {
  const t = (deg * Math.PI) / 180
  return [cx + rx * Math.sin(t), cy + ry * Math.cos(t)]
}

function strand({ cx, cy, rx, ry, from, to, count }) {
  return Array.from({ length: count }, (_, i) => {
    const deg = from + ((to - from) * i) / (count - 1)
    return [...ellipsePoint(cx, cy, rx, ry, deg), deg]
  })
}

const outer = strand({ cx: 300, cy: 20, rx: 236, ry: 270, from: -78, to: 78, count: 31 })
const inner = strand({ cx: 300, cy: 20, rx: 186, ry: 206, from: -74, to: 74, count: 25 })

function Drop({ x, y, deg, len = 20, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${-deg * 0.25}) scale(${scale})`}>
      <line x1="0" y1="6" x2="0" y2={len} stroke="url(#hg-gold)" strokeWidth="2" />
      <path d={`M0 ${len}c6 7 9 11 9 15.5a9 9 0 0 1-18 0C-9 ${len + 11} -6 ${len + 7} 0 ${len}z`} fill="url(#hg-gold)" />
      <path d={`M0 ${len + 8}c3 4 4.5 6 4.5 8a4.5 4.5 0 0 1-9 0c0-2 1.5-4 4.5-8z`} fill="url(#hg-ruby)" />
    </g>
  )
}

export default function HeroArt({ className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_30%,#8E2637_0%,#5A1420_45%,#3E0D16_100%)]" />
      <div className="texture-dots absolute inset-0 opacity-60" />

      {/* Mandala */}
      <svg
        viewBox="-200 -200 400 400"
        className="absolute left-1/2 top-[30%] w-[150vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-[0.16] lg:left-[72%] lg:top-1/2 lg:w-[62vw]"
      >
        <g fill="none" stroke="#E8CF8A" strokeWidth="0.8">
          {[190, 160, 120, 80, 46].map((r) => (
            <circle key={r} r={r} />
          ))}
          {Array.from({ length: 24 }, (_, i) => (
            <ellipse key={i} rx="16" ry="38" cy="-122" transform={`rotate(${i * 15})`} />
          ))}
          {Array.from({ length: 16 }, (_, i) => (
            <path key={i} d="M0-46C10-62 10-70 0-80-10-70-10-62 0-46z" transform={`rotate(${i * 22.5})`} />
          ))}
          {Array.from({ length: 48 }, (_, i) => (
            <circle key={i} r="2.4" cy="-175" transform={`rotate(${i * 7.5})`} />
          ))}
        </g>
      </svg>

      {/* Necklace */}
      <svg
        viewBox="0 0 600 420"
        className="absolute left-1/2 top-[3%] w-[min(92vw,460px)] -translate-x-1/2 drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)] lg:left-auto lg:right-[4%] lg:top-1/2 lg:w-[min(46vw,640px)] lg:-translate-x-0 lg:-translate-y-1/2"
      >
        <defs>
          <radialGradient id="hg-gold" cx="35%" cy="30%" r="75%">
            <stop offset="0" stopColor="#FFF3C4" />
            <stop offset="0.45" stopColor="#E3BE62" />
            <stop offset="1" stopColor="#9C7224" />
          </radialGradient>
          <radialGradient id="hg-ruby" cx="35%" cy="30%" r="75%">
            <stop offset="0" stopColor="#F27B8C" />
            <stop offset="0.5" stopColor="#B0213A" />
            <stop offset="1" stopColor="#5C0A18" />
          </radialGradient>
          <radialGradient id="hg-pearl" cx="35%" cy="30%" r="75%">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.6" stopColor="#F3E9D6" />
            <stop offset="1" stopColor="#C9B999" />
          </radialGradient>
        </defs>

        {/* inner pearl strand */}
        {inner.map(([x, y], i) => (
          <circle key={`i${i}`} cx={x} cy={y} r="5.2" fill="url(#hg-pearl)" />
        ))}

        {/* outer gold strand with drops */}
        {outer.map(([x, y, deg], i) =>
          i % 3 === 0 && Math.abs(deg) < 70 && Math.abs(deg) > 4 ? <Drop key={`d${i}`} x={x} y={y} deg={deg} /> : null,
        )}
        {outer.map(([x, y], i) => (
          <g key={`o${i}`}>
            <circle cx={x} cy={y} r={i % 2 ? 6 : 8.5} fill="url(#hg-gold)" />
            {i % 2 === 0 && <circle cx={x} cy={y} r="3.4" fill="url(#hg-ruby)" />}
          </g>
        ))}

        {/* central pendant */}
        <g transform="translate(300 290)">
          <line x1="0" y1="0" x2="0" y2="16" stroke="url(#hg-gold)" strokeWidth="3" />
          <g transform="translate(0 50)">
            {Array.from({ length: 16 }, (_, i) => (
              <circle key={i} r="4.2" cy="-33" transform={`rotate(${i * 22.5})`} fill="url(#hg-pearl)" />
            ))}
            <circle r="27" fill="url(#hg-gold)" />
            <circle r="19" fill="none" stroke="#9C7224" strokeWidth="1.2" />
            <circle r="13" fill="url(#hg-ruby)" />
            <circle r="4" cx="-4" cy="-5" fill="#fff" opacity=".45" />
          </g>
          <g transform="translate(0 86)">
            <line x1="0" y1="0" x2="0" y2="10" stroke="url(#hg-gold)" strokeWidth="2.5" />
            <path d="M0 10c9 10 13 16 13 22a13 13 0 0 1-26 0c0-6 4-12 13-22z" fill="url(#hg-gold)" />
            <path d="M0 21c4 5 6.5 8 6.5 11a6.5 6.5 0 0 1-13 0c0-3 2.5-6 6.5-11z" fill="url(#hg-ruby)" />
          </g>
        </g>
      </svg>
    </div>
  )
}
