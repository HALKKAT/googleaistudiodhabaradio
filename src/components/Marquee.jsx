import React from 'react';

export default function Marquee({ playlistName, theme }) {
  const items = [
    playlistName.toUpperCase(),
    ...theme.marqueeItems,
    "● HIGHWAY STEREO",
    playlistName.toUpperCase()
  ];

  return (
    <div className="marquee-wrapper" role="region" aria-label="Playlist announcement banner">
      <div className="marquee-content">
        {items.map((item, idx) => (
          <span key={`m1-${idx}`} className="marquee-item">
            {item} <span className="separator">✦</span>
          </span>
        ))}
      </div>
      <div className="marquee-content" aria-hidden="true">
        {items.map((item, idx) => (
          <span key={`m2-${idx}`} className="marquee-item">
            {item} <span className="separator">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}