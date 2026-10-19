import React from 'react';

/**
 * Custom SVG/CSS Dhaba Tape Deck & Retro Roadside Speaker.
 * Animates smoothly when isPlaying is true.
 * Respects prefers-reduced-motion.
 */
export default function DhabaVisualizer({ isPlaying, playlistName }) {
  return (
    <div className={`visualizer-container ${isPlaying ? 'playing' : 'paused'}`}>
      <div className="cassette-body">
        {/* Truck Horn Graphic Accent */}
        <div className="cassette-header-bar">
          <span className="deck-screws">●</span>
          <span className="deck-label">HIGHWAY TAPE DECK • AUTO REVERSE</span>
          <span className="deck-screws">●</span>
        </div>

        {/* Cassette Title Label Sticker */}
        <div className="cassette-sticker">
          <div className="sticker-lines top"></div>
          <p className="sticker-text">{playlistName}</p>
          <div className="sticker-lines bottom"></div>
          <span className="side-badge">SIDE A [STEREO]</span>
        </div>

        {/* Tape Reels Center Window */}
        <div className="cassette-window">
          <div className="tape-spool left-spool">
            <div className={`spool-cog ${isPlaying ? 'spin' : ''}`}>
              <div className="cog-tooth"></div>
              <div className="cog-tooth deg60"></div>
              <div className="cog-tooth deg120"></div>
            </div>
          </div>

          <div className="tape-bridge">
            <div className={`tape-strip ${isPlaying ? 'tape-flowing' : ''}`}></div>
            <div className="tape-counter">088</div>
          </div>

          <div className="tape-spool right-spool">
            <div className={`spool-cog ${isPlaying ? 'spin' : ''}`}>
              <div className="cog-tooth"></div>
              <div className="cog-tooth deg60"></div>
              <div className="cog-tooth deg120"></div>
            </div>
          </div>
        </div>

        {/* Equalizer Visualizer Bars */}
        <div className="dhaba-eq-bars" aria-hidden="true">
          {[40, 75, 95, 60, 85, 50, 90, 65, 80, 45, 100, 70].map((h, i) => (
            <div 
              key={i} 
              className={`eq-bar ${isPlaying ? 'bouncing' : ''}`} 
              style={{ 
                '--max-h': `${h}%`,
                animationDelay: `${(i * 0.08).toFixed(2)}s` 
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}