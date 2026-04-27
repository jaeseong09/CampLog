export default function ConstellationSign() {
  return (
    <svg width="90" height="120" viewBox="0 0 90 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 기둥 */}
      <rect x="40" y="60" width="10" height="58" rx="3" fill="#6B4226" />
      <rect x="41" y="60" width="4" height="58" rx="2" fill="#8B5E3C" />

      {/* 표지판 판 */}
      <rect x="4" y="10" width="82" height="56" rx="6" fill="#5A3010" />
      <rect x="6" y="12" width="78" height="52" rx="5" fill="#7A4A20" />
      {/* 나뭇결 */}
      <line x1="6" y1="24" x2="84" y2="24" stroke="#6B4226" strokeWidth="1" opacity="0.5" />
      <line x1="6" y1="38" x2="84" y2="38" stroke="#6B4226" strokeWidth="1" opacity="0.5" />
      <line x1="6" y1="52" x2="84" y2="52" stroke="#6B4226" strokeWidth="1" opacity="0.5" />

      {/* 별자리 선 */}
      <line x1="20" y1="20" x2="35" y2="30" stroke="rgba(255,240,150,0.6)" strokeWidth="1" />
      <line x1="35" y1="30" x2="50" y2="22" stroke="rgba(255,240,150,0.6)" strokeWidth="1" />
      <line x1="50" y1="22" x2="65" y2="32" stroke="rgba(255,240,150,0.6)" strokeWidth="1" />
      <line x1="65" y1="32" x2="72" y2="20" stroke="rgba(255,240,150,0.6)" strokeWidth="1" />
      <line x1="35" y1="30" x2="45" y2="50" stroke="rgba(255,240,150,0.6)" strokeWidth="1" />
      <line x1="50" y1="22" x2="45" y2="50" stroke="rgba(255,240,150,0.6)" strokeWidth="1" />

      {/* 별 점들 */}
      {[
        [20, 20, 3.5], [35, 30, 2.5], [50, 22, 4], [65, 32, 3],
        [72, 20, 2.5], [45, 50, 3], [28, 48, 2],
      ].map(([cx, cy, r], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={r + 2} fill="rgba(255,240,100,0.15)" />
          <circle cx={cx} cy={cy} r={r} fill="#FFE864" />
          <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.35} fill="white" opacity="0.7" />
        </g>
      ))}
    </svg>
  )
}
