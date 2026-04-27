export default function Squirrel() {
  return (
    <svg width="90" height="100" viewBox="0 0 90 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 꼬리 */}
      <path d="M55 85 C80 70 85 45 75 25 C68 10 52 15 54 35 C56 55 42 65 38 75"
        stroke="#8B5E2A" strokeWidth="13" strokeLinecap="round" fill="none"/>
      <path d="M55 85 C80 70 85 45 75 25 C68 10 52 15 54 35 C56 55 42 65 38 75"
        stroke="#C8864A" strokeWidth="8" strokeLinecap="round" fill="none"/>

      {/* 몸통 */}
      <ellipse cx="36" cy="75" rx="16" ry="20" fill="#C8864A"/>
      <ellipse cx="36" cy="82" rx="11" ry="11" fill="#EDBA80"/>

      {/* 앞발 */}
      <ellipse cx="24" cy="90" rx="7" ry="4" fill="#A0622A" transform="rotate(-15 24 90)"/>
      <ellipse cx="48" cy="90" rx="7" ry="4" fill="#A0622A" transform="rotate(15 48 90)"/>

      {/* 머리 */}
      <circle cx="36" cy="50" r="15" fill="#C8864A"/>
      {/* 귀 */}
      <ellipse cx="25" cy="38" rx="6" ry="9" fill="#C8864A" transform="rotate(-15 25 38)"/>
      <ellipse cx="47" cy="38" rx="6" ry="9" fill="#C8864A" transform="rotate(15 47 38)"/>
      <ellipse cx="25" cy="38" rx="3" ry="5" fill="#EDBA80" transform="rotate(-15 25 38)"/>
      <ellipse cx="47" cy="38" rx="3" ry="5" fill="#EDBA80" transform="rotate(15 47 38)"/>

      {/* 얼굴 */}
      <ellipse cx="36" cy="57" rx="9" ry="6" fill="#EDBA80"/>
      {/* 눈 */}
      <circle cx="30" cy="48" r="3" fill="#2C1A0E"/>
      <circle cx="42" cy="48" r="3" fill="#2C1A0E"/>
      <circle cx="31" cy="47" r="1" fill="white"/>
      <circle cx="43" cy="47" r="1" fill="white"/>
      {/* 코 */}
      <ellipse cx="36" cy="54" rx="2.5" ry="2" fill="#7A3A1A"/>

      {/* 도토리 */}
      <ellipse cx="36" cy="68" rx="6" ry="7" fill="#A0622A"/>
      <rect x="32" y="61" width="8" height="5" rx="2.5" fill="#5A3010"/>
      <line x1="36" y1="61" x2="36" y2="57" stroke="#5A3010" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}