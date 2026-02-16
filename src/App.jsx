import 'leaflet/dist/leaflet.css'
import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'


function App() {
  const [time, setTime] = useState(new Date());
  const [articles, setArticles] = useState([]);
  const [nasaData, setNasaData] = useState(null);
  const [upcomingLaunches, setUpcomingLaunches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setLoading(true);

    // 1. Cosmic Chronicles - Spaceflight News API (v4)
    const fetchCosmicNews = fetch('https://api.spaceflightnewsapi.net/v4/articles/?limit=4')
      .then(res => res.json())
      .then(data => {
        if (data.results) setArticles(data.results);
      })
      .catch(err => console.error("Cosmic Uplink Failed", err));

    // 2. NASA Deep Intel - APOD
    const fetchNasa = fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
      .then(res => res.json())
      .then(data => setNasaData(data))
      .catch(err => console.error("NASA Uplink Failed", err));

    // 3. Launch Initiatives - Upcoming Rocket Launches
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

  const getTheme = () => {
    return {
      bg: 'radial-gradient(circle at center, #1b2735 0%, #090a0f 100%)',
      card: 'rgba(10, 15, 30, 0.6)',
      text: '#e0e6ed',
      accent: '#7dd3fc',
      label: 'WISE_IR_NAV_OS',
      mapTile: 'https://alasky.u-strasbg.fr/AllWISE/RGB/tiles/Norder3/Dir0/{z}/{x}/{y}.jpg'
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
        <p style={{ fontSize: '0.8rem', letterSpacing: '10px', color: theme.accent, margin: '0 0 -10px 0', opacity: 0.7 }}>STARBASE_v4</p>
        <h1 style={{ fontSize: '5rem', margin: '0', color: theme.accent, textShadow: `0 0 25px ${theme.accent}66` }}>
          {formatTime(time)}
        </h1>
        <p style={{ fontSize: '1rem', letterSpacing: '6px', opacity: 0.8 }}>MISSION_TIME // {formatDate(time)}</p>
      </div>

      <div style={{ display: 'flex', flex: 1.2, height: '40%' }}>
        <div style={glassCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${theme.accent}`, paddingBottom: '10px' }}>
            <h2 style={{ margin: 0 }}>COSM_CHRON</h2>
            <span style={{ fontSize: '0.6rem', color: theme.accent, border: `1px solid ${theme.accent}`, padding: '2px 5px' }}>STARLINK_FEED</span>
          </div>
          {loading ? <p>TUNING FREQUENCY...</p> : articles.map((a, i) => (
            <p key={i} style={{ margin: '12px 0', textAlign: 'left', fontSize: '0.8rem' }}>
              <a href={a.url} target="_blank" rel="noreferrer" style={{ color: theme.text, textDecoration: 'none', borderLeft: `3px solid ${theme.accent}`, paddingLeft: '8px', display: 'block' }}>
                {a.title}
              </a>
            </p>
          ))}
        </div>

        <div style={glassCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${theme.accent}`, paddingBottom: '10px' }}>
            <h2 style={{ margin: 0 }}>DEEP_SKY_INTEL</h2>
            <span style={{ fontSize: '0.6rem', color: theme.accent, border: `1px solid ${theme.accent}`, padding: '2px 5px', whiteSpace: 'nowrap' }}>NASA_LINK_ESTABLISHED</span>
          </div>
          {loading ? <p>DOWNLOAD_TELEMETRY...</p> : nasaData && (
            <div style={{ marginTop: '15px', textAlign: 'left' }}>
              {nasaData.media_type === 'image' && (
                <img src={nasaData.url} alt="Celestial Object" style={{ width: '100%', borderRadius: '5px', marginBottom: '10px', boxShadow: `0 0 15px ${theme.accent}33` }} />
              )}
              <h3 style={{ fontSize: '0.8rem', color: theme.accent, marginBottom: '5px' }}>{nasaData.title}</h3>
              <p style={{ fontSize: '0.7rem', opacity: 0.8, lineHeight: '1.4' }}>
                {nasaData.explanation?.substring(0, 140)}...
              </p>
            </div>
          )}
        </div>

        <div style={glassCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${theme.accent}`, paddingBottom: '10px' }}>
            <h2 style={{ margin: 0 }}>LAUNCH_INIT</h2>
            <span style={{ fontSize: '0.6rem', color: theme.accent, border: `1px solid ${theme.accent}`, padding: '2px 5px', whiteSpace: 'nowrap' }}>ESCAPE_VELOCITY_PREP</span>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: '100%' }}>
            {loading ? <p>CALCULATING_TRAJECTORY...</p> : upcomingLaunches.map((l, i) => (
              <div key={i} style={{ margin: '15px 0', textAlign: 'left', fontSize: '0.8rem', borderLeft: `3px solid ${theme.accent}`, paddingLeft: '8px' }}>
                <div style={{ color: theme.accent, fontWeight: 'bold', fontSize: '0.7rem', marginBottom: '2px' }}>
                  {l.name}
                </div>
                <div style={{ opacity: 0.7, fontSize: '0.6rem' }}>{l.provider?.name || 'PRIVATE_SECTOR'}</div>
                <div style={{ opacity: 0.85, lineHeight: '1.4', marginTop: '4px' }}>T-MINUS: {l.t0 || 'HOLDING'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🌍 THE LIVE MAP */}
      <div style={{ ...glassCard, flex: 2, position: 'relative', overflow: 'hidden', padding: '0', marginTop: '10px' }}>
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%', background: '#000' }}
          zoomControl={false}
          crs={window.L.CRS.Simple}
        >
          <TileLayer
            url={theme.mapTile}
            noWrap={true}
            tms={false}
          />
        </MapContainer>
        <div style={{
          position: 'absolute', top: '10px', right: '10px', zIndex: 1000,
          background: 'rgba(10,15,30,0.8)', padding: '5px 15px', border: `1px solid ${theme.accent}`,
          fontSize: '0.7rem', color: theme.accent, borderBottomLeftRadius: '10px'
        }}>
          🔭 ALLWISE_IR_SURVEY: SYNC_SUCCESS
        </div>
      </div>
    </div>
  )
}

export default App