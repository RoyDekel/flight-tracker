// Catalog of supported airports with coordinates, names, cities, and countries
export const AIRPORTS = {
  TLV: { code: 'TLV', name: 'Ben Gurion Airport', city: 'Tel Aviv', country: 'Israel', coords: [32.0114, 34.8867] },
  KRK: { code: 'KRK', name: 'John Paul II Airport', city: 'Krakow', country: 'Poland', coords: [50.0777, 19.7848] },
  LHR: { code: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom', coords: [51.4700, -0.4543] },
  CDG: { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', coords: [49.0097, 2.5479] },
  JFK: { code: 'JFK', name: 'John F. Kennedy Intl Airport', city: 'New York', country: 'United States', coords: [40.6413, -73.7781] },
  DXB: { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', coords: [25.2532, 55.3657] },
  FCO: { code: 'FCO', name: 'Leonardo da Vinci Airport', city: 'Rome', country: 'Italy', coords: [41.8003, 12.2389] },
  NRT: { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', coords: [35.7720, 140.3929] },
  ATH: { code: 'ATH', name: 'Eleftherios Venizelos Airport', city: 'Athens', country: 'Greece', coords: [37.9356, 23.9484] }
};

// Airline Directory with colors and codes
export const AIRLINES = {
  W6: { code: 'W6', name: 'Wizz Air', logo: '✈️', color: '#e0007b', type: 'lowcost' },
  FR: { code: 'FR', name: 'Ryanair', logo: '🔵', color: '#0033a0', type: 'lowcost' },
  LO: { code: 'LO', name: 'LOT Polish Airlines', logo: '🇵🇱', color: '#002663', type: 'national' },
  LY: { code: 'LY', name: 'EL AL Israel Airlines', logo: '🇮🇱', color: '#133068', type: 'national' },
  BA: { code: 'BA', name: 'British Airways', logo: '🇬🇧', color: '#00205b', type: 'national' },
  AF: { code: 'AF', name: 'Air France', logo: '🇫🇷', color: '#00209f', type: 'national' },
  DL: { code: 'DL', name: 'Delta Air Lines', logo: '🔺', color: '#e01933', type: 'national' },
  EK: { code: 'EK', name: 'Emirates', logo: '🔺', color: '#d71920', type: 'national' },
  JL: { code: 'JL', name: 'Japan Airlines', logo: '🇯🇵', color: '#d90011', type: 'national' }
};

// Shared helper: Haversine formula to compute great circle distance in kilometers
export const getDistance = (coords1, coords2) => {
  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;
  const R = 6371; // Earth radius in km
  
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

// Shared helper: Format duration from hours to "Xh Ym"
export const formatDuration = (hours) => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
};

// Shared helper: Calculate cost structure for passenger count
export const calculatePassengerCost = (basePrice, passengers) => {
  const { adults = 1, children = 0, infants = 0 } = passengers;
  const adultCost = adults * basePrice;
  const childCost = children * (basePrice * 0.75);
  const infantCost = infants * (basePrice * 0.10);
  
  return {
    adults: Math.round(adultCost),
    children: Math.round(childCost),
    infants: Math.round(infantCost),
    total: Math.round(adultCost + childCost + infantCost)
  };
};

// Shared helper: Generate flight slots using a specific base price
export const generateFlightsWithBasePrice = (originCode, destinationCode, dateStr, direction, passengers, basePrice) => {
  const origin = AIRPORTS[originCode];
  const destination = AIRPORTS[destinationCode];
  if (!origin || !destination) return [];
  
  const distance = getDistance(origin.coords, destination.coords);
  const durationHours = (distance / 760) + 0.5;
  const durationStr = formatDuration(durationHours);
  
  let carrierOptions = [];
  if (distance < 1500) {
    carrierOptions = ['W6', 'FR', 'LO', 'LY'];
  } else if (distance >= 1500 && distance < 4500) {
    carrierOptions = ['LO', 'LY', 'BA', 'AF'];
  } else {
    carrierOptions = ['LY', 'BA', 'AF', 'DL', 'EK', 'JL'];
  }
  
  const availableCarriers = carrierOptions
    .map(code => AIRLINES[code] || AIRLINES.LO)
    .slice(0, 4);
    
  const departures = ['06:20', '11:45', '16:10', '21:30'];
  const aircraftModels = [
    distance > 4000 ? 'Boeing 777-300ER' : 'Boeing 737 MAX 8',
    distance > 4000 ? 'Airbus A350-900' : 'Airbus A321neo',
    distance > 4000 ? 'Boeing 787-9 Dreamliner' : 'Boeing 737-800',
    distance > 4000 ? 'Airbus A330-900neo' : 'Boeing 737-900ER'
  ];

  return availableCarriers.map((airline, idx) => {
    const tierMultiplier = airline.type === 'lowcost' ? 0.85 : 1.15;
    const timeMultiplier = idx === 0 ? 0.95 : idx === 2 ? 1.05 : 1.0;
    const adultPrice = Math.round(basePrice * tierMultiplier * timeMultiplier);
    const priceDetails = calculatePassengerCost(adultPrice, passengers);
    
    const [depHours, depMins] = departures[idx].split(':').map(Number);
    let arrHours = Math.floor(depHours + durationHours);
    let arrMins = Math.round(depMins + (durationHours - Math.floor(durationHours)) * 60);
    if (arrMins >= 60) {
      arrHours += 1;
      arrMins -= 60;
    }
    const nextDay = arrHours >= 24;
    arrHours = arrHours % 24;
    
    const formattedArrival = `${String(arrHours).padStart(2, '0')}:${String(arrMins).padStart(2, '0')}`;
    const baggageDesc = airline.type === 'lowcost' 
      ? '1 small personal bag (underseat) included. Carry-on costs extra.' 
      : '1 carry-on (8kg) + 1 checked bag (23kg) included.';

    return {
      id: `TRAVELPAYOUTS-${airline.code}-${idx + 100}-${direction}-${dateStr}`,
      flightNumber: `${airline.code} ${idx + 101 + (direction === 'return' ? 10 : 0)}`,
      airlineCode: airline.code,
      airlineName: airline.name,
      departureTime: departures[idx],
      arrivalTime: formattedArrival + (nextDay ? ' (+1d)' : ''),
      duration: durationStr,
      durationVal: durationHours,
      price: adultPrice,
      passengerCosts: priceDetails,
      cabinClass: airline.type === 'lowcost' ? 'Economy' : 'Economy Standard',
      stops: 'Direct',
      planeType: aircraftModels[idx],
      terminal: `${originCode} T${idx === 2 ? '1' : '3'} → ${destinationCode} T1`,
      baggage: baggageDesc,
      reliability: `${90 + (idx % 3) * 3}% On-Time`,
      seatsRemaining: Math.floor(2 + (airline.code.charCodeAt(0) % 8)),
      direction,
      origin: originCode,
      destination: destinationCode,
      distance
    };
  });
};
