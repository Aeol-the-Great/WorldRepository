import 'leaflet/dist/leaflet.css'
import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'


function App() {
  const [time, setTime] = useState(new Date());
  const [articles, setArticles] = useState([]);
  const [nasaData, setNasaData] = useState(null);
  const [upcomingLaunches, setUpcomingLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'highlights'

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchCosmicNews = fetch('https://api.spaceflightnewsapi.net/v4/articles/?limit=10')
      .then(res => res.json())
      .then(data => {
        if (data.results) setArticles(data.results);
      })
      .catch(err => console.error("Cosmic Uplink Failed", err));

    const fetchNasa = fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
      .then(res => res.json())
      .then(data => setNasaData(data))
      .catch(err => console.error("NASA Uplink Failed", err));

    const fetchLaunches = fetch('https://fdo.rocketlaunch.live/repository/daily/next')
      .then(res => res.json())
      .then(data => {
        if (data.launches) setUpcomingLaunches(data.launches.slice(0, 4));
      })
      .catch(err => console.error("Launch Intel Failed", err));

    Promise.allSettled([fetchCosmicNews, fetchNasa, fetchLaunches]).finally(() => {
      setLoading(false);
    });
  }, []);

  const getTheme = () => ({
    bg: 'radial-gradient(circle at center, #1b2735 0%, #090a0f 100%)',
    card: 'rgba(10, 15, 30, 0.7)',
    text: '#e0e6ed',
    accent: '#7dd3fc',
    menuBg: 'rgba(5, 10, 20, 0.95)',
    mapTile: 'https://alasky.u-strasbg.fr/AllWISE/RGB/tiles/Norder3/Dir0/{z}/{x}/{y}.jpg'
  });

  const theme = getTheme();
  const techFont = '"Orbitron", sans-serif';
  const displayFont = '"Inter", sans-serif';

  const glassCard = {
    background: theme.card, backdropFilter: 'blur(20px)', borderRadius: '10px', padding: '20px',
    margin: '10px', flex: 1, color: theme.text, border: `1px solid ${theme.accent}`,
    boxShadow: `0 0 20px ${theme.accent}44`, textAlign: 'center', overflowY: 'auto', textTransform: 'uppercase'
  };

  const renderDashboard = () => (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '15px', overflow: 'hidden', border: `1px solid ${theme.accent}33` }}>
      {/* FLOATING HEADER */}
      <div style={{
        position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 1000, pointerEvents: 'none', textAlign: 'center',
        background: 'rgba(5, 10, 20, 0.4)', padding: '10px 40px', backdropFilter: 'blur(10px)',
        borderRadius: '50px', border: `1px solid ${theme.accent}22`
      }}>
        <p style={{ fontSize: '0.6rem', letterSpacing: '8px', color: theme.accent, margin: '0 0 -5px 0', opacity: 0.6 }}>SYSTEM_SYNC_ONLINE</p>
        <h1 style={{ fontSize: '3.5rem', margin: '0', color: theme.accent, textShadow: `0 0 20px ${theme.accent}44`, lineHeight: '1' }}>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </h1>
        <p style={{ fontSize: '0.7rem', letterSpacing: '4px', opacity: 0.8, marginTop: '5px' }}>
          {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}
        </p>
      </div>

      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%', background: '#000' }}
        zoomControl={false}
        crs={window.L.CRS.Simple}
      >
        <TileLayer url={theme.mapTile} noWrap={true} tms={false} />
      </MapContainer>

      {/* MAP STATUS OVERLAYS */}
      <div style={{
        position: 'absolute', bottom: '20px', right: '20px', zIndex: 1000,
        background: 'rgba(10,15,30,0.8)', padding: '8px 20px', border: `1px solid ${theme.accent}`,
        fontSize: '0.6rem', color: theme.accent, borderRadius: '4px', letterSpacing: '2px'
      }}>
        🔭 ALLWISE_IR_SURVEY ACTIVE // GRID_SECTOR: 0.0.0
      </div>

      <div style={{
        position: 'absolute', bottom: '20px', left: '20px', zIndex: 1000,
        background: 'rgba(10,15,30,0.8)', padding: '8px 20px', border: `1px solid ${theme.accent}`,
        fontSize: '0.6rem', color: theme.accent, borderRadius: '4px', letterSpacing: '2px'
      }}>
        COORDINATES: {Math.floor(Math.random() * 360)}° N / {Math.floor(Math.random() * 360)}° E
      </div>
    </div>
  );

  const renderHighlights = () => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: displayFont, padding: '20px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.accent}` }}>
        <h1 style={{ fontFamily: techFont, color: theme.accent }}>ASTRONOMY_HIGHLIGHTS</h1>
        <button
          onClick={() => setView('dashboard')}
          style={{ background: 'none', border: `1px solid ${theme.accent}`, color: theme.accent, padding: '5px 15px', cursor: 'pointer', fontFamily: techFont }}
        >
          RETURN_TO_COMMAND
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
        {articles.map((article, i) => (
          <div key={i} style={{
            background: theme.card,
            border: `1px solid ${theme.accent}33`,
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }} onClick={() => window.open(article.url, '_blank')}>
            <img src={article.image_url} alt="" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            <div style={{ padding: '15px' }}>
              <p style={{ fontSize: '0.7rem', color: theme.accent, marginBottom: '5px' }}>{new Date(article.published_at).toLocaleDateString()}</p>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', fontWeight: '600', color: '#fff' }}>{article.title}</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.7, lineHeight: '1.5' }}>{article.summary.substring(0, 120)}...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const sidebarModuleStyle = {
    background: 'rgba(10, 20, 40, 0.4)',
    border: `1px solid ${theme.accent}33`,
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    textAlign: 'left',
    fontSize: '0.75rem'
  };

  return (
    <div style={{
      height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column',
      padding: '20px', boxSizing: 'border-box', fontFamily: techFont,
      background: theme.bg, color: theme.text, overflow: 'hidden'
    }}>

      {/* SIDEBAR TRIGGER */}
      <div
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          position: 'fixed', left: '20px', top: '50%', transform: 'translateY(-50%)',
          width: '40px', height: '40px', border: `1px solid ${theme.accent}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 2000, background: 'rgba(5,10,20,0.8)',
          boxShadow: `0 0 15px ${theme.accent}22`, transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 0 20px ${theme.accent}66`}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = `0 0 15px ${theme.accent}22`}
      >
        <div style={{
          width: '24px', height: '24px', border: `1px solid ${theme.accent}66`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.8rem', color: theme.accent, transform: menuOpen ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.4s ease'
        }}>
          {menuOpen ? '«' : '>'}
        </div>
      </div>

      {/* OVERLAY NAVIGATION MENU + INTEL COLUMNS */}
      <div style={{
        position: 'fixed', left: menuOpen ? '0' : '-520px', top: 0, height: '100vh', width: '500px',
        background: theme.menuBg, borderRight: `1px solid ${theme.accent}44`,
        backdropFilter: 'blur(30px)',
        transition: 'all 0.6s cubic-bezier(0.19, 1, 0.22, 1)', zIndex: 1900,
        display: 'flex', flexDirection: 'column', padding: '60px 40px', gap: '10px',
        overflowY: 'auto'
      }}>
        <div style={{
          fontSize: '0.65rem', color: theme.accent, letterSpacing: '4px',
          marginBottom: '10px', borderLeft: `3px solid ${theme.accent}`, paddingLeft: '10px'
        }}>
          STATION_SYSTEMS_OVERRIDE
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => { setView('dashboard'); }}
            className="tab-button"
            style={{
              flex: 1, background: view === 'dashboard' ? 'rgba(125, 211, 252, 0.1)' : 'none',
              border: `1px solid ${theme.accent}22`, color: view === 'dashboard' ? theme.accent : '#fff',
              fontSize: '0.7rem', cursor: 'pointer', fontFamily: techFont, padding: '10px'
            }}
          >
            STARM_MAP
          </button>
          <button
            onClick={() => { setView('highlights'); }}
            className="tab-button"
            style={{
              flex: 1, background: view === 'highlights' ? 'rgba(125, 211, 252, 0.1)' : 'none',
              border: `1px solid ${theme.accent}22`, color: view === 'highlights' ? theme.accent : '#fff',
              fontSize: '0.7rem', cursor: 'pointer', fontFamily: techFont, padding: '10px'
            }}
          >
            CHRON_ARCHIVE
          </button>
        </div>

        {/* INTEGRATED INTEL COLUMNS */}
        <div style={{ marginTop: '10px' }}>
          <div style={sidebarModuleStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${theme.accent}33`, marginBottom: '10px', paddingBottom: '5px' }}>
              <span style={{ color: theme.accent, fontWeight: 'bold' }}>COSM_CHRON</span>
              <span style={{ fontSize: '0.5rem', opacity: 0.6 }}>LIVE_FEED</span>
            </div>
            {loading ? <p>SYNCING...</p> : articles.slice(0, 3).map((a, i) => (
              <a key={i} href={a.url} target="_blank" rel="noreferrer" style={{ color: theme.text, textDecoration: 'none', display: 'block', margin: '8px 0', borderLeft: `2px solid ${theme.accent}44`, paddingLeft: '8px', fontSize: '0.7rem' }}>
                {a.title}
              </a>
            ))}
          </div>

          <div style={sidebarModuleStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${theme.accent}33`, marginBottom: '10px', paddingBottom: '5px' }}>
              <span style={{ color: theme.accent, fontWeight: 'bold' }}>DEEP_SKY_INTEL</span>
              <span style={{ fontSize: '0.5rem', opacity: 0.6 }}>NASA_APOD</span>
            </div>
            {nasaData && (
              <div style={{ fontSize: '0.7rem' }}>
                <a href={nasaData.hdurl || nasaData.url} target="_blank" rel="noreferrer">
                  <img src={nasaData.url} alt="" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }} />
                </a>
                <div style={{ color: theme.accent, marginBottom: '4px', cursor: 'pointer' }} onClick={() => window.open(`https://apod.nasa.gov/apod/ap${nasaData.date.replace(/-/g, '').slice(2)}.html`, '_blank')}>
                  {nasaData.title}
                </div>
                <div style={{ opacity: 0.7, lineHeight: '1.3' }}>{nasaData.explanation?.substring(0, 100)}...</div>
              </div>
            )}
          </div>

          <div style={sidebarModuleStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${theme.accent}33`, marginBottom: '10px', paddingBottom: '5px' }}>
              <span style={{ color: theme.accent, fontWeight: 'bold' }}>LAUNCH_INIT</span>
              <span style={{ fontSize: '0.5rem', opacity: 0.6 }}>TRAJECTORY_DATA</span>
            </div>
            {upcomingLaunches.slice(0, 2).map((l, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <div style={{ color: theme.accent, fontWeight: 'bold' }}>{l.name}</div>
                <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>{l.provider?.name} // {l.t0 || 'HOLD'}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 'auto', fontSize: '0.5rem', opacity: 0.3, fontFamily: displayFont }}>
          PROTOCOL: 88-ALPHA // SECTOR: {Math.floor(Math.random() * 9999)}<br />
          STATION_COORD: 0.0000 / 0.0000
        </div>
      </div>

      {/* MAIN VIEW */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', width: '100%',
        transition: 'all 0.6s cubic-bezier(0.19, 1, 0.22, 1)',
        filter: menuOpen ? 'blur(8px) brightness(0.6) grayscale(0.5)' : 'none',
        transform: menuOpen ? 'scale(0.98)' : 'none',
        pointerEvents: menuOpen ? 'none' : 'auto'
      }}>
        {view === 'dashboard' ? renderDashboard() : renderHighlights()}
      </div>

      <style>{`
        .tab-button:hover {
          background: rgba(125, 211, 252, 0.1) !important;
          border-color: #7dd3fc !important;
        }
        *::-webkit-scrollbar { width: 4px; }
        *::-webkit-scrollbar-track { background: transparent; }
        *::-webkit-scrollbar-thumb { background: #7dd3fc33; border-radius: 10px; }
      `}</style>
    </div>
  );
}

export default App;