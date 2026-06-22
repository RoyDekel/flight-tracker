import React, { useState, useEffect, useRef } from 'react';
import { Plane, Calendar, Bookmark, Bell, Compass, Activity, ArrowLeftRight } from 'lucide-react';
import { 
  generateFlightDatabase, 
  getFlightTelemetry 
} from './utils/flightSimulator';
import FlightMap from './components/FlightMap';
import PriceChart from './components/PriceChart';
import FlightDetails from './components/FlightDetails';
import AlternativeFlights from './components/AlternativeFlights';
import Watchlist from './components/Watchlist';
import AlertsManager from './components/AlertsManager';

export default function App() {
  // 1. Core State
  const [flightDatabase, setFlightDatabase] = useState(() => generateFlightDatabase());
  const [direction, setDirection] = useState('outbound'); // 'outbound' (TLV->KRK) or 'return' (KRK->TLV)
  const [selectedDate, setSelectedDate] = useState('2026-08-11'); // Outbound target date
  
  const [activeFlight, setActiveFlight] = useState(() => {
    const database = generateFlightDatabase();
    return database.outbound['2026-08-11'][0]; // Default: Wizz Air Aug 11 Outbound
  });

  // 2. Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0); // 0.0 to 1.0
  const [simulationSpeed, setSimulationSpeed] = useState(5); // 1x, 5x, 20x

  // 3. User saved settings & history (Sync with localStorage)
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('alerts');
    return saved ? JSON.parse(saved) : [
      {
        id: 'seed-alert-1',
        flightNumber: 'W6 5122',
        flightId: 'W6-5122-out-2026-08-11',
        type: 'price-drop',
        thresholdPrice: 130,
        isActive: true,
        createdAt: '12:00 PM'
      },
      {
        id: 'seed-alert-2',
        flightNumber: 'W6 5122',
        flightId: 'W6-5122-out-2026-08-11',
        type: 'status-change',
        thresholdPrice: null,
        isActive: true,
        createdAt: '12:00 PM'
      }
    ];
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 'seed-notif-1',
        time: '12:00 PM',
        flightNumber: 'W6 5122',
        type: 'system',
        message: 'AeroTrack flight tracker initialized. Select "Return flight" in the header to view Krakow to Tel-Aviv routes.'
      }
    ];
  });

  // 4. Tab Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifBadge, setShowNotifBadge] = useState(false);

  // Keep track of the last simulated flight status to detect status changes
  const prevStatusRef = useRef('Scheduled');

  // Compute live telemetry based on progress and direction
  const isOutboundDirection = activeFlight.direction === 'outbound';
  const telemetry = getFlightTelemetry(simulationProgress, isOutboundDirection);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Handle Route Direction Switch (Outbound vs Return)
  const handleDirectionSwitch = (newDirection) => {
    if (newDirection === direction) return;

    setDirection(newDirection);
    setIsSimulating(false);
    setSimulationProgress(0);

    const defaultDate = newDirection === 'outbound' ? '2026-08-11' : '2026-08-16';
    setSelectedDate(defaultDate);
    
    const firstFlight = flightDatabase[newDirection][defaultDate][0];
    setActiveFlight(firstFlight);
    
    prevStatusRef.current = 'Scheduled';
  };

  // Telemetry Simulation loop
  useEffect(() => {
    let intervalId = null;

    if (isSimulating) {
      intervalId = setInterval(() => {
        setSimulationProgress((prev) => {
          const next = prev + 0.001 * simulationSpeed;
          if (next >= 1.0) {
            setIsSimulating(false);
            return 1.0;
          }
          return next;
        });
      }, 50);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSimulating, simulationSpeed]);

  // Monitor flight status transitions to fire notifications
  useEffect(() => {
    const currentStatus = telemetry.status;
    const prevStatus = prevStatusRef.current;

    if (currentStatus !== prevStatus) {
      // Find rules matching status updates for active flight
      const statusRules = alerts.filter(
        (a) => a.flightNumber === activeFlight.flightNumber && a.type === 'status-change'
      );

      if (statusRules.length > 0) {
        const newNotif = {
          id: `status-shift-${Date.now()}`,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          flightNumber: activeFlight.flightNumber,
          type: 'status-alert',
          message: `Flight status updated to: ${currentStatus.toUpperCase()}`
        };

        setNotifications((prev) => [newNotif, ...prev]);
        setShowNotifBadge(true);
      }

      prevStatusRef.current = currentStatus;
    }
  }, [telemetry.status, alerts, activeFlight.flightNumber]);

  // Market Engine: Fluctuate prices of all flights periodically
  useEffect(() => {
    const priceInterval = setInterval(() => {
      // Pick random direction
      const randomDirection = Math.random() > 0.5 ? 'outbound' : 'return';
      const dates = Object.keys(flightDatabase[randomDirection]);
      const randomDate = dates[Math.floor(Math.random() * dates.length)];
      const flightsOnDate = flightDatabase[randomDirection][randomDate] || [];
      if (flightsOnDate.length === 0) return;

      const randomIndex = Math.floor(Math.random() * flightsOnDate.length);
      const flightToAlter = flightsOnDate[randomIndex];

      const change = Math.random() > 0.55 ? 5 : -5;
      const originalPrice = flightToAlter.price;
      const nextPrice = Math.max(50, originalPrice + change);

      if (originalPrice !== nextPrice) {
        setFlightDatabase((prevDb) => {
          const copy = { ...prevDb };
          copy[randomDirection][randomDate] = prevDb[randomDirection][randomDate].map((f, i) => {
            if (i === randomIndex) {
              return { ...f, price: nextPrice };
            }
            return f;
          });
          return copy;
        });

        // Update active flight details if altered flight is currently tracked
        if (flightToAlter.id === activeFlight.id) {
          setActiveFlight((prev) => ({ ...prev, price: nextPrice }));
        }

        // Check price alert triggers
        const triggeredRules = alerts.filter(
          (a) => a.flightId === flightToAlter.id && a.type === 'price-drop' && nextPrice <= a.thresholdPrice
        );

        if (triggeredRules.length > 0 && change < 0) {
          triggeredRules.forEach((rule) => {
            const priceNotif = {
              id: `price-drop-${Date.now()}-${rule.id}`,
              time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              flightNumber: flightToAlter.flightNumber,
              type: 'alert',
              message: `Price dropped to $${nextPrice}! (Threshold $${rule.thresholdPrice} met)`
            };

            setNotifications((prev) => [priceNotif, ...prev]);
            setShowNotifBadge(true);
          });
        }
      }
    }, 8000);

    return () => clearInterval(priceInterval);
  }, [flightDatabase, alerts, activeFlight.id]);

  // Watchlist Actions
  const handleToggleWatchlist = (flight) => {
    const exists = watchlist.some((w) => w.id === flight.id);
    if (exists) {
      setWatchlist(watchlist.filter((w) => w.id !== flight.id));
    } else {
      setWatchlist([...watchlist, flight]);
    }
  };

  const handleTrackFromWatchlist = (flight, dateStr) => {
    const flightDirection = flight.direction || 'outbound';
    setDirection(flightDirection);
    setSelectedDate(dateStr);
    setActiveFlight(flight);
    setSimulationProgress(0);
    setIsSimulating(false);
    setActiveTab('dashboard');
  };

  const handleOpenNotifications = () => {
    setActiveTab('alerts');
    setShowNotifBadge(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flexGrow: 1 }}>
      
      {/* HEADER SECTION */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-glass)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <Plane size={18} style={{ color: '#0b0f19', transform: 'rotate(45deg)' }} />
            </div>
            <h1 className="brand-gradient-text" style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
              AeroTrack
            </h1>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Advanced Live Flight Tracker & Price Engine
          </p>
        </div>

        {/* DIRECTION SWITCHER HUD */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-sm)',
          padding: '2px'
        }}>
          <button
            onClick={() => handleDirectionSwitch('outbound')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: 'none',
              background: direction === 'outbound' ? 'var(--bg-tertiary)' : 'transparent',
              color: direction === 'outbound' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            Outbound (TLV → KRK)
          </button>
          <button
            onClick={() => handleDirectionSwitch('return')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: 'none',
              background: direction === 'return' ? 'var(--bg-tertiary)' : 'transparent',
              color: direction === 'return' ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            Return (KRK → TLV)
          </button>
        </div>

        {/* NOTIFICATIONS HUD BELL */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={handleOpenNotifications}
            className="btn-icon" 
            style={{ position: 'relative' }}
            title="Notification logs"
          >
            <Bell size={18} />
            {showNotifBadge && (
              <span className="pulse-target" style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                border: '2px solid var(--bg-primary)'
              }}></span>
            )}
          </button>
        </div>
      </header>

      {/* DASHBOARD ROUTING TAB BAR */}
      <nav style={{
        display: 'flex',
        gap: '8px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-md)',
        padding: '6px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'dashboard', label: 'Dashboard HUD', icon: <Activity size={16} /> },
          { id: 'alternative', label: 'Find Flights', icon: <Compass size={16} /> },
          { id: 'watchlist', label: 'Watchlist', icon: <Bookmark size={16} /> },
          { id: 'alerts', label: 'Alert Center', icon: <Bell size={16} /> }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="btn"
              style={{
                background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--border-glass-bright)' : '1px solid transparent',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 18px',
                fontSize: '0.85rem',
                flexGrow: 1
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* TAB VIEWS CONTROLLER */}
      <main className="animate-fade-in" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* VIEW 1: DASHBOARD HUD */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-grid">
            
            {/* Left HUD Panel: Map & Pricing */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <FlightMap 
                telemetry={telemetry} 
                activeFlight={activeFlight} 
              />
              <PriceChart 
                activeFlight={activeFlight} 
              />
            </div>

            {/* Right Panel: Controls & Details */}
            <div>
              <FlightDetails 
                activeFlight={activeFlight}
                telemetry={telemetry}
                isSimulating={isSimulating}
                simulationProgress={simulationProgress}
                setSimulationProgress={setSimulationProgress}
                setIsSimulating={setIsSimulating}
                simulationSpeed={simulationSpeed}
                setSimulationSpeed={setSimulationSpeed}
                onToggleWatchlist={handleToggleWatchlist}
                isWatched={watchlist.some(w => w.id === activeFlight.id)}
                selectedDate={selectedDate}
                onOpenAlertModal={() => setActiveTab('alerts')}
              />
            </div>
            
          </div>
        )}

        {/* VIEW 2: ALTERNATIVE FLIGHTS & DATES */}
        {activeTab === 'alternative' && (
          <AlternativeFlights
            flightDatabase={flightDatabase[direction]}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            activeFlight={activeFlight}
            setActiveFlight={(flight) => {
              setActiveFlight(flight);
              setSimulationProgress(0);
              setIsSimulating(false);
              setActiveTab('dashboard');
            }}
            onToggleWatchlist={handleToggleWatchlist}
            watchlist={watchlist}
          />
        )}

        {/* VIEW 3: WATCHLIST MANAGER */}
        {activeTab === 'watchlist' && (
          <Watchlist
            watchlist={watchlist}
            onRemoveFromWatchlist={(id) => setWatchlist(watchlist.filter(w => w.id !== id))}
            onTrackFlight={handleTrackFromWatchlist}
            activeFlight={activeFlight}
          />
        )}

        {/* VIEW 4: ALERTS CONFIG & FEED */}
        {activeTab === 'alerts' && (
          <AlertsManager
            alerts={alerts}
            setAlerts={setAlerts}
            notifications={notifications}
            setNotifications={setNotifications}
            activeFlight={activeFlight}
            flightDatabase={flightDatabase}
          />
        )}

      </main>

      {/* FOOTER */}
      <footer style={{
        textAlign: 'center',
        padding: '24px 0 10px',
        borderTop: '1px solid var(--border-glass)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        AeroTrack Flight Data Client © 2026. Outbound (TLV ✈ KRK) • Return (KRK ✈ TLV).
      </footer>

    </div>
  );
}
