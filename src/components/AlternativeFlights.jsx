import React, { useState } from 'react';
import { Calendar, Filter, Sparkles, ArrowRight, Check, Globe } from 'lucide-react';
import { AIRLINES, getSkyscannerUrl } from '../utils/flightSimulator';

export default function AlternativeFlights({ 
  flightDatabase, 
  selectedDate, 
  setSelectedDate, 
  activeFlight, 
  setActiveFlight,
  onToggleWatchlist,
  watchlist
}) {
  const [sortKey, setSortKey] = useState('price'); // 'price', 'departureTime'
  const [filterCarrier, setFilterCarrier] = useState('ALL'); // 'ALL', 'W6', 'LO', 'FR', 'LY'

  const dates = Object.keys(flightDatabase).sort();

  // Find lowest price for each date to show in the calendar header strip
  const getLowestPriceForDate = (dateStr) => {
    const flights = flightDatabase[dateStr] || [];
    if (flights.length === 0) return null;
    return Math.min(...flights.map(f => f.price));
  };

  // Get flights for selected date
  const rawFlightsForDate = flightDatabase[selectedDate] || [];

  // Filter flights
  const filteredFlights = rawFlightsForDate.filter(flight => {
    if (filterCarrier === 'ALL') return true;
    return flight.airlineCode === filterCarrier;
  });

  // Sort flights
  const sortedFlights = [...filteredFlights].sort((a, b) => {
    if (sortKey === 'price') {
      return a.price - b.price;
    } else if (sortKey === 'departureTime') {
      return a.departureTime.localeCompare(b.departureTime);
    }
    return 0;
  });

  // Identify Cheapest flight
  const cheapestPrice = rawFlightsForDate.length > 0 
    ? Math.min(...rawFlightsForDate.map(f => f.price)) 
    : 0;

  // Format date labels
  const formatDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDateNumber = (dateStr) => {
    return new Date(dateStr).getDate();
  };

  // Get active route parameters for Skyscanner deep link
  const sampleFlight = rawFlightsForDate[0] || { origin: 'TLV', destination: 'KRK' };
  const origin = sampleFlight.origin;
  const destination = sampleFlight.destination;
  const skyscannerUrl = getSkyscannerUrl(origin, destination, selectedDate);

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Component Title */}
      <div>
        <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} style={{ color: 'var(--primary)' }} />
          Alternative Flights & Dates
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Compare surrounding dates and alternative carriers to secure the best deal
        </p>
      </div>

      {/* SURROUNDING DATES CALENDAR STRIP */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        borderBottom: '1px solid var(--border-glass)'
      }}>
        {dates.map((date) => {
          const isSelected = date === selectedDate;
          const lowestPrice = getLowestPriceForDate(date);
          const dayName = formatDayName(date);
          const dateNum = formatDateNumber(date);

          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              style={{
                flex: '1 0 70px',
                minWidth: '70px',
                background: isSelected 
                  ? 'linear-gradient(135deg, rgba(0, 242, 254, 0.15), rgba(79, 172, 254, 0.15))' 
                  : 'var(--bg-tertiary)',
                border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 6px',
                cursor: 'pointer',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                boxShadow: isSelected ? '0 0 12px var(--primary-glow-weak)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '0.7rem', color: isSelected ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                {dayName}
              </span>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {dateNum}
              </span>
              <span style={{ fontSize: '0.75rem', color: isSelected ? 'var(--text-primary)' : 'var(--primary)', fontWeight: 600 }}>
                {lowestPrice ? `$${lowestPrice}` : '--'}
              </span>
            </button>
          );
        })}
      </div>

      {/* SKYSCANNER FLIGHT AGGREGATOR BANNER */}
      <div style={{
        background: 'rgba(0, 180, 216, 0.08)',
        border: '1px solid rgba(0, 180, 216, 0.2)',
        borderRadius: 'var(--radius-sm)',
        padding: '14px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Globe size={20} style={{ color: '#00e1ff' }} />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Compare with Skyscanner Aggregator
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Launch a live search from <b>{origin}</b> to <b>{destination}</b> on Skyscanner for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.
            </div>
          </div>
        </div>
        
        <a
          href={skyscannerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
          style={{
            padding: '6px 14px',
            fontSize: '0.8rem',
            background: 'linear-gradient(135deg, #00b4d8, #0077b6)',
            color: '#fff',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            textDecoration: 'none',
            boxShadow: '0 4px 10px rgba(0, 180, 216, 0.2)'
          }}
        >
          Compare on Skyscanner
        </a>
      </div>

      {/* FILTER & SORT TOOLS ROW */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.85rem'
      }}>
        {/* Sort controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Sort by:</span>
          <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: '6px', border: '1px solid var(--border-glass)', padding: '2px' }}>
            <button
              onClick={() => setSortKey('price')}
              style={{
                padding: '4px 10px',
                borderRadius: '4px',
                border: 'none',
                background: sortKey === 'price' ? 'var(--bg-secondary)' : 'transparent',
                color: sortKey === 'price' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.75rem'
              }}
            >
              Cheapest
            </button>
            <button
              onClick={() => setSortKey('departureTime')}
              style={{
                padding: '4px 10px',
                borderRadius: '4px',
                border: 'none',
                background: sortKey === 'departureTime' ? 'var(--bg-secondary)' : 'transparent',
                color: sortKey === 'departureTime' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.75rem'
              }}
            >
              Time
            </button>
          </div>
        </div>

        {/* Carrier filter controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={14} style={{ color: 'var(--text-secondary)' }} />
          <select
            value={filterCarrier}
            onChange={(e) => setFilterCarrier(e.target.value)}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-glass)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              padding: '4px 12px 4px 8px',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Carriers</option>
            {Object.keys(AIRLINES).map(code => (
              <option key={code} value={code}>{AIRLINES[code].name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* FLIGHT LISTINGS CONTAINER */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sortedFlights.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-secondary)' }}>
            No flights match your filter criteria on this date.
          </div>
        ) : (
          sortedFlights.map((flight) => {
            const isCheapest = flight.price === cheapestPrice;
            const isActive = flight.id === activeFlight.id;
            const airline = AIRLINES[flight.airlineCode] || { name: 'Unknown', logo: '✈️', color: 'var(--primary)' };
            const isWatched = watchlist.some(w => w.id === flight.id);

            return (
              <div
                key={flight.id}
                style={{
                  background: isActive 
                    ? 'rgba(0, 242, 254, 0.04)' 
                    : 'rgba(255, 255, 255, 0.01)',
                  border: isActive 
                    ? '1.5px solid var(--primary)' 
                    : '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  position: 'relative',
                  boxShadow: isActive ? '0 0 15px rgba(0, 242, 254, 0.08)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Special Tags Overlay */}
                {isCheapest && (
                  <span style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '16px',
                    background: 'linear-gradient(135deg, #059669, #10b981)',
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <Sparkles size={10} /> Cheapest Deal
                  </span>
                )}

                {/* Airline & Number */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', minWidth: '150px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    border: '1px solid var(--border-glass)'
                  }}>
                    {airline.logo}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                      {flight.airlineName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {flight.flightNumber} • {flight.planeType}
                    </div>
                  </div>
                </div>

                {/* Schedule timeline */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '160px' }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{flight.departureTime}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{flight.origin}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '60px' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{flight.duration}</span>
                    <div style={{ width: '40px', height: '1.5px', background: 'var(--border-glass)', margin: '4px 0', position: 'relative' }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-muted)', position: 'absolute', top: '-1.2px', right: 0 }}></div>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--success)', fontWeight: 600 }}>{flight.stops}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{flight.arrivalTime}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{flight.destination}</div>
                  </div>
                </div>

                {/* Price block */}
                <div style={{ textAlign: 'center', minWidth: '80px' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ${flight.price}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    one-way
                  </div>
                </div>

                {/* Tracking Action Button */}
                <div style={{ display: 'flex', gap: '8px', minWidth: '120px' }}>
                  {isActive ? (
                    <button
                      className="btn"
                      disabled
                      style={{
                        flexGrow: 1,
                        background: 'rgba(0, 242, 254, 0.1)',
                        color: 'var(--primary)',
                        border: '1px solid var(--primary)',
                        padding: '6px 12px',
                        fontSize: '0.8rem',
                        cursor: 'default',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <Check size={14} /> Active
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveFlight(flight)}
                      className="btn btn-primary"
                      style={{
                        flexGrow: 1,
                        padding: '6px 12px',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      Track <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
