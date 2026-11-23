import React from 'react';

/**
 * Ilustrasi Vektor Surfing Pelabuhan Ratu
 * Menampilkan peselancar di atas gulungan ombak tropis dengan siluet matahari & perbukitan khas Pelabuhan Ratu.
 */
export default function SurfingIllustration({ className = 'w-full h-auto', style }) {
  return (
    <svg
      viewBox="0 0 640 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="Ilustrasi Surfing di Pantai Pelabuhan Ratu"
    >
      <defs>
        {/* Langit Gradien Senja Tropis */}
        <linearGradient id="skyGrad" x1="320" y1="0" x2="320" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="45%" stopColor="#047857" />
          <stop offset="75%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.85" />
        </linearGradient>

        {/* Matahari Emas */}
        <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
        </radialGradient>

        {/* Ombak Lapisan Luar */}
        <linearGradient id="waveGradDeep" x1="0" y1="180" x2="640" y2="380" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#065f46" />
          <stop offset="50%" stopColor="#0f766e" />
          <stop offset="100%" stopColor="#115e59" />
        </linearGradient>

        {/* Ombak Lapisan Tengah (Crest) */}
        <linearGradient id="waveGradMid" x1="0" y1="160" x2="640" y2="340" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="40%" stopColor="#14b8a6" />
          <stop offset="85%" stopColor="#065f46" />
          <stop offset="100%" stopColor="#042f2e" />
        </linearGradient>

        {/* Papan Selancar */}
        <linearGradient id="boardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>

        {/* Busa Ombak */}
        <linearGradient id="foamGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ccfbf1" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* 1. Latar Belakang Langit */}
      <rect width="640" height="380" rx="24" fill="url(#skyGrad)" />

      {/* 2. Matahari Senja Tropis */}
      <circle cx="480" cy="140" r="100" fill="url(#sunGrad)" opacity="0.6" />
      <circle cx="480" cy="140" r="54" fill="#fef08a" opacity="0.9" />

      {/* 3. Siluet Perbukitan Geopark & Pesisir Pelabuhan Ratu */}
      <path
        d="M0 240 Q100 190 220 220 T440 210 Q540 180 640 230 L640 380 L0 380 Z"
        fill="#064e3b"
        opacity="0.45"
      />
      <path
        d="M0 260 Q140 215 300 245 T640 240 L640 380 L0 380 Z"
        fill="#042f2e"
        opacity="0.7"
      />

      {/* Siluet Pohon Kelapa Pesisir Kiri */}
      <g opacity="0.35" transform="translate(20, 110) scale(0.7)">
        <path d="M40 160 Q50 90 25 20 Q55 35 70 8 Q65 40 95 30 Q70 55 80 80 Q60 65 40 160 Z" fill="#022c22" />
        <path d="M15 170 Q30 110 5 45 Q35 60 45 35 Q45 65 70 60 Q50 80 55 105 Q40 90 20 170 Z" fill="#022c22" />
      </g>

      {/* 4. Gulungan Ombak Raksasa (The Barrel / Tube Wave) */}
      <path
        d="M-20 380 C80 320 160 220 240 160 C310 110 380 90 440 110 C500 130 520 180 490 210 C460 235 410 220 395 190 C380 160 410 140 430 145 C410 120 350 120 300 160 C240 210 170 300 -20 380 Z"
        fill="url(#waveGradMid)"
      />

      {/* Puncak Ombak Melengkung (Curling Lip) */}
      <path
        d="M260 150 C330 100 420 90 480 120 C520 140 530 180 495 210 C480 175 450 145 390 140 C330 135 290 155 260 150 Z"
        fill="#a7f3d0"
        opacity="0.8"
      />

      {/* Lipatan Air Ombak Dalam (Water Flow Lines) */}
      <path d="M100 360 Q220 260 340 190 T480 170" stroke="#5eead4" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" fill="none" />
      <path d="M50 370 Q180 290 300 230 T440 195" stroke="#99f6e4" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" fill="none" />
      <path d="M0 380 Q140 320 260 270 T400 230" stroke="#a7f3d0" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" fill="none" />

      {/* Busa Putih di Puncak Ombak (Wave Crest Foam) */}
      <g fill="url(#foamGrad)">
        <ellipse cx="440" cy="115" rx="22" ry="10" transform="rotate(-15 440 115)" />
        <ellipse cx="470" cy="130" rx="18" ry="8" transform="rotate(20 470 130)" />
        <ellipse cx="495" cy="160" rx="16" ry="9" transform="rotate(60 495 160)" />
        <ellipse cx="485" cy="195" rx="20" ry="11" transform="rotate(30 485 195)" />
        <circle cx="430" cy="108" r="7" />
        <circle cx="410" cy="115" r="5" />
        <circle cx="390" cy="125" r="4.5" />
        <circle cx="365" cy="140" r="4" />
        <circle cx="340" cy="155" r="3.5" />
        {/* Percikan Air Busa (Spray droplets) */}
        <circle cx="515" cy="145" r="3" fill="#ffffff" opacity="0.9" />
        <circle cx="530" cy="165" r="2.5" fill="#ffffff" opacity="0.8" />
        <circle cx="525" cy="185" r="3.5" fill="#ffffff" opacity="0.7" />
        <circle cx="540" cy="195" r="2" fill="#ffffff" opacity="0.85" />
        <circle cx="510" cy="215" r="4" fill="#ffffff" opacity="0.75" />
        <circle cx="530" cy="225" r="2.5" fill="#ffffff" opacity="0.6" />
        <circle cx="460" cy="95" r="2" fill="#ffffff" opacity="0.9" />
        <circle cx="475" cy="100" r="3" fill="#ffffff" opacity="0.8" />
      </g>

      {/* 5. SOSOK PESELANCAR (THE SURFER) */}
      <g transform="translate(245, 120)">
        {/* Papan Selancar (Surfboard) */}
        <g transform="rotate(22 65 95)">
          {/* Bayangan Papan di Air */}
          <ellipse cx="68" cy="104" rx="58" ry="10" fill="#042f2e" opacity="0.5" />
          {/* Badan Papan Selancar */}
          <path
            d="M8 95 C25 82 85 82 125 95 C85 108 25 108 8 95 Z"
            fill="url(#boardGrad)"
            stroke="#fef08a"
            strokeWidth="1.5"
          />
          {/* Garis Strip Papan (Stringer) */}
          <path d="M12 95 L121 95" stroke="#ffffff" strokeWidth="1.2" opacity="0.9" />
          {/* Sirip Papan (Fin) */}
          <path d="M30 98 L24 108 L34 102 Z" fill="#042f2e" />
        </g>

        {/* Cipratan Air di Belakang Ekor Papan (Tail Spray) */}
        <path
          d="M20 115 Q5 100 -10 95 Q0 110 15 122 Z"
          fill="#ffffff"
          opacity="0.8"
        />
        <circle cx="-5" cy="92" r="2.5" fill="#ffffff" opacity="0.8" />
        <circle cx="-15" cy="102" r="2" fill="#ffffff" opacity="0.7" />

        {/* Tubuh Peselancar (Karakter Atletis) */}
        {/* Kaki Belakang (Menekuk di Ekor Papan) */}
        <path
          d="M45 105 L52 85 L62 92 L68 108"
          stroke="#0f172a"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Kaki Depan (Menapak Stabil di Tengah Papan) */}
        <path
          d="M68 95 L82 78 L95 98 L104 100"
          stroke="#0f172a"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Celana Surfing (Boardshorts Teal/Emerald) */}
        <path
          d="M56 82 L76 75 L85 86 L64 94 Z"
          fill="#059669"
          stroke="#047857"
          strokeWidth="1"
        />

        {/* Tubuh / Badan (Torso Condong ke Depan) */}
        <path
          d="M66 80 L76 50 L90 54 L80 82 Z"
          fill="#1e293b"
          stroke="#0f172a"
          strokeWidth="1"
        />

        {/* Tangan Kiri (Menjaga Keseimbangan ke Belakang) */}
        <path
          d="M72 55 L52 48 L32 55"
          stroke="#0f172a"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Tangan Kanan (Terentang Elegan Mengarahkan Ombak) */}
        <path
          d="M86 54 L110 52 L128 42"
          stroke="#0f172a"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Leher & Kepala */}
        <ellipse cx="85" cy="40" rx="7.5" ry="8.5" fill="#0f172a" />
        
        {/* Rambut / Helm Surfing Dinamis */}
        <path d="M78 40 Q84 30 92 35 Q94 42 88 44 Z" fill="#334155" />
      </g>

      {/* 6. Lapisan Ombak Bawah & Dasar Pantai */}
      <path
        d="M-20 340 Q160 260 340 310 T660 280 L660 380 L-20 380 Z"
        fill="url(#waveGradDeep)"
        opacity="0.9"
      />

      {/* Garis Buih Bawah Pantai Kumala */}
      <path
        d="M0 350 Q160 330 320 355 T640 340"
        stroke="#ccfbf1"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="16 8 24 10"
        opacity="0.75"
        fill="none"
      />
      <path
        d="M0 368 Q180 350 360 370 T640 360"
        stroke="#99f6e4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="20 12"
        opacity="0.6"
        fill="none"
      />

      {/* 7. Drone Mini Melayang di Langit (Dokumentasi Aerial 4K) */}
      <g transform="translate(420, 48) scale(0.9)">
        {/* Bodi Drone */}
        <rect x="18" y="14" width="14" height="8" rx="3" fill="#1e293b" />
        {/* Lensa Kamera Drone */}
        <circle cx="25" cy="24" r="3" fill="#38bdf8" />
        {/* Lengan Drone */}
        <line x1="8" y1="8" x2="42" y2="28" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="8" x2="8" y2="28" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
        {/* Baling-baling Putar (Blur Effect) */}
        <ellipse cx="8" cy="8" rx="8" ry="2.5" fill="#94a3b8" opacity="0.7" />
        <ellipse cx="42" cy="8" rx="8" ry="2.5" fill="#94a3b8" opacity="0.7" />
        <ellipse cx="8" cy="28" rx="8" ry="2.5" fill="#94a3b8" opacity="0.7" />
        <ellipse cx="42" cy="28" rx="8" ry="2.5" fill="#94a3b8" opacity="0.7" />
        {/* Sinyal / Lampu Indikator Hijau */}
        <circle cx="21" cy="18" r="1.5" fill="#10b981" />
        <circle cx="29" cy="18" r="1.5" fill="#ef4444" />
      </g>

      {/* 8. Burung Camar Tropis di Langit */}
      <path d="M220 70 Q228 62 236 70 Q244 62 252 70" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M260 85 Q266 79 272 85 Q278 79 284 85" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.6" />
    </svg>
  );
}
