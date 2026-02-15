import 'leaflet/dist/leaflet.css'
import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'


function App() {
  const [time, setTime] = useState(new Date());
  const [articles, setArticles] = useState([]);
  const [nasaData, setNasaData] = useState(null);
  const [historyEvents, setHistoryEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const month = time.getMonth() + 1;
    const day = time.getDate();

    // Migrating to Institutional & Curated Sources
    const newsUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=5fdbc23d4e2d4a35adb49c1616743cee`;
    const scienceUrl = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY`;
    const historyUrl = `https://today.zenquotes.io/api/${month}/${day}`;

    setLoading(true);

    Promise.all([
      fetch(newsUrl).then(res => res.json()),
      fetch(scienceUrl).then(res => res.json()),
      fetch(historyUrl).then(res => res.json())
    ])
      .then(([newsData, nasa, historyData]) => {
        if (newsData.articles) setArticles(newsData.articles.slice(0, 4));
        setNasaData(nasa);
        if (historyData.data && historyData.data.Events) {
          setHistoryEvents(historyData.data.Events.slice(0, 4));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Uplink Error:", err);
        setLoading(false);
      });
  }, []);

  const getTheme = () => {
    const hour = time.getHours();
    if (hour >= 5 && hour < 10) return {
      bg: 'linear-gradient(135deg, #FF9A8B 0%, #FFD1FF 50%, #98E2E6 100%)',
      card: 'rgba(255, 255, 255, 0.3)', text: '#2d1b4e', accent: '#008080', label: 'SYSTEM_BOOT_MORNING',
      mapTile: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    };
    if (hour >= 10 && hour < 17) return {
      bg: 'linear-gradient(to bottom, #4facfe 0%, #00f2fe 100%)',
      card: 'rgba(255, 255, 255, 0.2)', text: 'white', accent: '#ffffff', label: 'SYSTEM_OPTIMAL_MIDDAY',
      mapTile: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
    };
    if (hour >= 17 && hour < 20) return {
      bg: 'linear-gradient(180deg, #ff5e62 0%, #ff9966 50%, #2d1b4e 100%)',
      card: 'rgba(45, 27, 78, 0.4)', text: '#ffe4e1', accent: '#ffab91', label: 'SYSTEM_DUSK_MODE',
      mapTile: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
    };
    return {
      bg: '#000000', card: 'rgba(20, 20, 20, 0.8)', text: 'white', accent: '#00FFFF', label: 'VOID_LORD_NIGHT_PHASE',
      mapTile: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    };
  };

  const theme = getTheme();
  const techFont = '"Orbitron", sans-serif';
  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatDate = (date) => date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  const glassCard = {
    background: theme.card, backdropFilter: 'blur(20px)', borderRadius: '10px', padding: '20px',
    margin: '10px', flex: 1, color: theme.text, border: `1px solid ${theme.accent}`,
    boxShadow: `0 0 20px ${theme.accent}44`, textAlign: 'center', overflowY: 'auto', textTransform: 'uppercase'
  };

  return (
    <div style={{
      height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column',
      padding: '20px', boxSizing: 'border-box', fontFamily: techFont,
      background: theme.bg, color: theme.text, transition: 'all 2.5s ease-in-out'
    }}>

      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <h1 style={{ fontSize: '5rem', margin: '0', color: theme.accent, textShadow: `0 0 25px ${theme.accent}` }}>
          {formatTime(time)}
        </h1>
        <p style={{ fontSize: '1.2rem', letterSpacing: '6px' }}>{formatDate(time)}</p>
      </div>

      <div style={{ display: 'flex', flex: 1.2, height: '40%' }}>
        <div style={glassCard}>
          <h2 style={{ borderBottom: `2px solid ${theme.accent}`, paddingBottom: '10px' }}>CHRONICLES_LOG</h2>
          {loading ? <p>SYNCING...</p> : articles.map((a, i) => (
            <p key={i} style={{ margin: '12px 0', textAlign: 'left', fontSize: '0.8rem' }}>
              <a href={a.url} target="_blank" rel="noreferrer" style={{ color: theme.text, textDecoration: 'none', borderLeft: `3px solid ${theme.accent}`, paddingLeft: '8px' }}>
                {a.title}
              </a>
            </p>
          ))}
        </div>

        <div style={glassCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${theme.accent}`, paddingBottom: '10px' }}>
            <h2 style={{ margin: 0 }}>NASA_INTEL</h2>
            <span style={{ fontSize: '0.6rem', color: theme.accent, border: `1px solid ${theme.accent}`, padding: '2px 5px', whiteSpace: 'nowrap' }}>INSTITUTION_VERIFIED</span>
          </div>
          {loading ? <p>SYNCING NASA...</p> : nasaData && (
            <div style={{ marginTop: '15px', textAlign: 'left' }}>
              {nasaData.media_type === 'image' && (
                <img src={nasaData.url} alt="NASA APOD" style={{ width: '100%', borderRadius: '5px', marginBottom: '10px', filter: 'grayscale(0.3) contrast(1.1)' }} />
              )}
              <h3 style={{ fontSize: '0.8rem', color: theme.accent, marginBottom: '5px' }}>{nasaData.title}</h3>
              <p style={{ fontSize: '0.7rem', opacity: 0.8, lineHeight: '1.4' }}>
                {nasaData.explanation?.substring(0, 160)}...
              </p>
            </div>
          )}
        </div>

        <div style={glassCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${theme.accent}`, paddingBottom: '10px' }}>
            <h2 style={{ margin: 0 }}>CURATED_HISTORY</h2>
            <span style={{ fontSize: '0.6rem', color: theme.accent, border: `1px solid ${theme.accent}`, padding: '2px 5px', whiteSpace: 'nowrap' }}>PEER_REVIEWED</span>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: '100%' }}>
            {loading ? <p>RECALLING...</p> : historyEvents.map((e, i) => (
              <div key={i} style={{ margin: '15px 0', textAlign: 'left', fontSize: '0.8rem', borderLeft: `3px solid ${theme.accent}`, paddingLeft: '8px' }}>
                <div style={{ color: theme.accent, fontWeight: 'bold', fontSize: '0.7rem', marginBottom: '2px' }}>[{e.year}]</div>
                <div style={{ opacity: 0.85, lineHeight: '1.4' }}>{e.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🌍 THE LIVE MAP */}
      <div style={{ ...glassCard, flex: 2, position: 'relative', overflow: 'hidden', padding: '0', marginTop: '10px' }}>
        <MapContainer
          center={[13.7563, 100.5018]} // Center on Thailand!
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer url={theme.mapTile} />
        </MapContainer>
        <div style={{
          position: 'absolute', top: '10px', right: '10px', zIndex: 1000,
          background: 'rgba(0,0,0,0.7)', padding: '5px 15px', border: `1px solid ${theme.accent}`,
          fontSize: '0.7rem', color: theme.accent
        }}>
          🛰️ LIVE_TERRA_FEED: ACTIVE
        </div>
      </div>
    </div>
  )
}

export default App