export default function PigeonNest() {
  return (
    <svg width="110" height="90" viewBox="0 0 110 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 둥지 바닥 */}
      <ellipse cx="55" cy="72" rx="40" ry="14" fill="#8B5E3C"/>
      {/* 둥지 외벽 */}
      <path d="M18 72 Q20 50 55 46 Q90 50 92 72" fill="#7A4F2D"/>
      {/* 둥지 내부 */}
      <ellipse cx="55" cy="66" rx="30" ry="10" fill="#5A3010"/>
      {/* 나뭇가지 엮임 텍스처 */}
      <path d="M20 68 Q30 58 55 55 Q80 58 90 68" fill="none" stroke="#A07040" strokeWidth="2.5" strokeDasharray="5 3"/>
      <path d="M22 74 Q32 64 55 61 Q78 64 88 74" fill="none" stroke="#6B4226" strokeWidth="2" strokeDasharray="4 4"/>
      <path d="M24 79 Q34 72 55 70 Q76 72 86 79" fill="none" stroke="#9B6E3A" strokeWidth="1.5" strokeDasharray="6 3"/>

      {/* 비둘기 1 — 둥지 왼쪽 */}
      <ellipse cx="40" cy="55" rx="14" ry="10" fill="#C8C5BE"/>
      <circle cx="28" cy="48" r="10" fill="#D8D5CE"/>
      <ellipse cx="26" cy="46" rx="5" ry="4" fill="#EDEAE4"/>
      <circle cx="25" cy="46" r="2.2" fill="#2C1A0E"/>
      <circle cx="25.6" cy="45.4" r="0.7" fill="white"/>
      <path d="M21 48.5 L16 50 L21 51.5" fill="#D4A055"/>
      <path d="M35 53 Q43 48 52 53" stroke="#9A978F" strokeWidth="2.5" fill="none"/>
      <path d="M35 56 Q43 51 52 56" stroke="#9A978F" strokeWidth="2" fill="none"/>

      {/* 비둘기 2 — 둥지 오른쪽 */}
      <ellipse cx="72" cy="52" rx="13" ry="9" fill="#C8C5BE"/>
      <circle cx="84" cy="46" r="9" fill="#D8D5CE"/>
      <ellipse cx="86" cy="44" rx="4" ry="3.5" fill="#EDEAE4"/>
      <circle cx="87" cy="44" r="2" fill="#2C1A0E"/>
      <circle cx="87.6" cy="43.4" r="0.6" fill="white"/>
      <path d="M91 46 L96 47.5 L91 49" fill="#D4A055"/>
      <path d="M75 50 Q67 45 60 50" stroke="#9A978F" strokeWidth="2.5" fill="none"/>
      <path d="M75 53 Q67 48 60 53" stroke="#9A978F" strokeWidth="2" fill="none"/>
    </svg>
  )
}