import React, { useState, useEffect, useRef } from 'react';
import { SITE_CONFIG } from './config';
import { inferTheme, updateDocumentSEO } from './themeEngine';
import { extractPlaylistId } from './youtubeHelper';
import Marquee from './components/Marquee';
import DhabaVisualizer from './components/DhabaVisualizer';
import PlayerControls from './components/PlayerControls';
import StoryCardModal from './components/StoryCardModal';

export default function App() {
  const theme = inferTheme(SITE_CONFIG.playlistName);
  const playlistId = extractPlaylistId(SITE_CONFIG.youtubePlaylistUrl);

  // States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [activeTitle, setActiveTitle] = useState("");
  const [statusIdx, setStatusIdx] = useState(0);
  const [playerError, setPlayerError] = useState(null);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);

  // Dynamically set CSS variables & SEO on mount / config change
  useEffect(() => {
    updateDocumentSEO(SITE_CONFIG, theme);

    const root = document.documentElement;
    root.style.setProperty('--bg-color', theme.colors.bg);
    root.style.setProperty('--card-bg', theme.colors.cardBg);
    root.style.setProperty('--primary-color', theme.colors.primary);
    root.style.setProperty('--accent-color', theme.colors.accent);
    root.style.setProperty('--neon-color', theme.colors.neon);
    root.style.setProperty('--text-color', theme.colors.text);
    root.style.setProperty('--muted-color', theme.colors.muted);
    root.style.setProperty('--border-color', theme.colors.border);
    root.style.setProperty('--font-title', theme.fontTitle);
    root.style.setProperty('--font-body', theme.fontBody);
  }, [SITE_CONFIG.playlistName]);

  // Periodic Microcopy Rotator
  useEffect(() => {
    const timer = setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % theme.statusMessages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [theme.statusMessages.length]);

  // Initialize YouTube IFrame API with strictly correct origin & policies
  useEffect(() => {
    if (!playlistId) {
      setPlayerError("Playlist link doesn't look right. Please check the URL.");
      return;
    }

    let isSubscribed = true;

    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
    };

    window.onYouTubeIframeAPIReady = () => {
      if (!isSubscribed) return;
      initPlayer();
    };

    const initPlayer = () => {
      try {
        if (playerRef.current) {
          playerRef.current.destroy();
        }

        // Compliant with YouTube Origin security policies (prevents Error 153)
        playerRef.current = new window.YT.Player('youtube-hidden-frame', {
          height: '100%',
          width: '100%',
          playerVars: {
            listType: 'playlist',
            list: playlistId,
            enablejsapi: 1,
            origin: window.location.origin, // Dynamically matches local and prod
            playsinline: 1,
            autoplay: 0,
            controls: 0,
            rel: 0
          },
          events: {
            onReady: (event) => {
              event.target.setVolume(volume);
              const data = event.target.getVideoData();
              if (data && data.title) {
                setActiveTitle(data.title);
              }
            },
            onStateChange: (event) => {
              // 1 = PLAYING, 2 = PAUSED, 0 = ENDED, 3 = BUFFERING
              if (event.data === 1) {
                setIsPlaying(true);
                const data = event.target.getVideoData();
                if (data && data.title) setActiveTitle(data.title);
              } else if (event.data === 2 || event.data === 0) {
                setIsPlaying(false);
              }
            },
            onError: (err) => {
              console.warn("YouTube Player Status:", err.data);
              if (err.data === 153) {
                setPlayerError("Player couldn't verify this website origin. Try opening the deployed HTTPS version.");
              } else if (err.data === 101 || err.data === 150) {
                setPlayerError("This specific track isn't available for embedded playback. Auto-skipping...");
                setTimeout(() => {
                  try {
                    playerRef.current?.nextVideo();
                    setPlayerError(null);
                  } catch (e) {
                    console.error(e);
                  }
                }, 1800);
              } else {
                setPlayerError("Playback error occurred. Switching track...");
              }
            }
          }
        });
      } catch (err) {
        console.error("Player initialization exception:", err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      loadYouTubeAPI();
    }

    return () => {
      isSubscribed = false;
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [playlistId]);

  // Action Handlers
  const handlePlayPause = () => {
    if (!playerRef.current || !playerRef.current.getPlayerState) return;
    try {
      const state = playerRef.current.getPlayerState();
      if (state === 1) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (playerRef.current?.nextVideo) {
      playerRef.current.nextVideo();
      setIsPlaying(true);
      setPlayerError(null);
    }
  };

  const handlePrevious = () => {
    if (playerRef.current?.previousVideo) {
      playerRef.current.previousVideo();
      setIsPlaying(true);
      setPlayerError(null);
    }
  };

  const handleToggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume || 70);
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const handleChangeVolume = (newVal) => {
    setVolume(newVal);
    if (playerRef.current) {
      playerRef.current.setVolume(newVal);
      if (newVal > 0 && isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    }
  };

  const handleShareLink = async () => {
    const shareData = {
      title: SITE_CONFIG.playlistName,
      text: `${SITE_CONFIG.playlistName} — ${theme.tagline}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast(theme.shareConfirm);
        return;
      } catch (err) {
        if (err.name !== 'AbortError') copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast(theme.shareConfirm);
    }).catch(() => {
      showToast("Link copied!");
    });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  return (
    <div className="app-canvas">
      {/* Background Animated Desi Highway Road / Ambience */}
      <div className="highway-bg-overlay" aria-hidden="true">
        <div className="road-perspective">
          <div className="road-lane-marks"></div>
        </div>
        <div className="grain-texture"></div>
      </div>

      <header className="site-header">
        <div className="top-badge-container">
          <span className="live-status-pill" style={{ borderColor: theme.badgeColor }}>
            <span className={`pulsing-dot ${isPlaying ? 'glow' : ''}`}></span>
            {theme.badge}
          </span>
          <span className="truck-tag">✦ 24x7 NON STOP ✦</span>
        </div>

        <h1 className="hero-playlist-title">{SITE_CONFIG.playlistName}</h1>
        <p className="hero-playlist-tagline">{theme.tagline}</p>
      </header>

      {/* Marquee Banner */}
      <Marquee playlistName={SITE_CONFIG.playlistName} theme={theme} />

      <main className="main-content-layout">
        {/* Themed Central SVG Cassette / Deck */}
        <section className="visualizer-section" aria-label="Audio Visualizer">
          <DhabaVisualizer isPlaying={isPlaying} playlistName={SITE_CONFIG.playlistName} />
        </section>

        {/* Dynamic Microcopy Status Card */}
        <div className="microcopy-card" role="status" aria-live="polite">
          <span className="truck-horn-icon">📢</span>
          <span className="microcopy-text">"{theme.statusMessages[statusIdx]}"</span>
        </div>

        {/* Current Playing Track Banner */}
        <div className="current-track-hud">
          <span className="hud-label">NOW ROLLING:</span>
          <span className="hud-track-title">
            {activeTitle || "Ready on Highway Frequency (Click Play)"}
          </span>
        </div>

        {/* Error Notification Banner if URL or playback issue occurs */}
        {playerError && (
          <div className="error-banner" role="alert">
            <span className="error-icon">⚠️</span>
            <span>{playerError}</span>
          </div>
        )}

        {/* Interactive Controls */}
        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          volume={volume}
          onChangeVolume={handleChangeVolume}
          onOpenStory={() => setShowStoryModal(true)}
          onShareLink={handleShareLink}
          hasError={!!playerError && !playlistId}
        />
      </main>

      {/* YouTube API Target (Visually offscreen, strictly unmuted & active) */}
      <div 
        ref={playerContainerRef} 
        className="yt-iframe-offscreen" 
        aria-hidden="true"
      >
        <div id="youtube-hidden-frame"></div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification" role="status">
          {toastMessage}
        </div>
      )}

      {/* Instagram Story 9:16 Card Modal */}
      <StoryCardModal
        isOpen={showStoryModal}
        onClose={() => setShowStoryModal(false)}
        playlistName={SITE_CONFIG.playlistName}
        theme={theme}
      />

      <footer className="site-footer">
        <p>Built for late-night journeys, chai tapris & high-beam audio vibes.</p>
        <p className="copyright-note">Uses official YouTube IFrame Embed API • Zero Data Harvested</p>
      </footer>
    </div>
  );
}