// AeroTrack Flight & Price Simulator Engine

// Coordinates
export const TLV_COORDS = [32.0114, 34.8867]; // Ben Gurion Airport
export const KRK_COORDS = [50.0777, 19.7848]; // Krakow Airport

// Base airlines data
export const AIRLINES = {
  W6: { name: 'Wizz Air', logo: '✈️', color: '#e0007b' },
  LO: { name: 'LOT Polish Airlines', logo: '🇵🇱', color: '#002663' },
  FR: { name: 'Ryanair', logo: '🔵', color: '#0033a0' },
  LY: { name: 'EL AL Israel Airlines', logo: '🇮🇱', color: '#133068' }
};

// Generate flights for a range of dates in both directions (Outbound and Return)
// Outbound: August 8 to August 15 (targeting August 11)
// Return: August 13 to August 20 (targeting August 16)
export const generateFlightDatabase = () => {
  const database = {
    outbound: {},
    return: {}
  };
  
  const outboundDates = [
    '2026-08-08', '2026-08-09', '2026-08-10', '2026-08-11',
    '2026-08-12', '2026-08-13', '2026-08-14', '2026-08-15'
  ];

  const returnDates = [
    '2026-08-13', '2026-08-14', '2026-08-15', '2026-08-16',
    '2026-08-17', '2026-08-18', '2026-08-19', '2026-08-20'
  ];

  // 1. OUTBOUND (TLV -> KRK)
  outboundDates.forEach((date) => {
    const dayOfWeek = new Date(date).getDay();
    const dateFactor = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6 ? 1.25 : 1.0;
    const dateOffset = (new Date(date).getDate() - 11) * 3.5;

    database.outbound[date] = [
      {
        id: `W6-5122-out-${date}`,
        flightNumber: 'W6 5122',
        airlineCode: 'W6',
        airlineName: AIRLINES.W6.name,
        departureTime: '12:45',
        arrivalTime: '16:35',
        duration: '3h 50m',
        price: Math.round((140 + dateOffset) * dateFactor),
        cabinClass: 'Economy',
        stops: 'Direct',
        planeType: 'Airbus A321neo',
        terminal: 'TLV T3 → KRK T1',
        baggage: '1 personal item (40x30x20cm) included',
        reliability: '92% On-Time',
        seatsRemaining: 4,
        direction: 'outbound',
        origin: 'TLV',
        destination: 'KRK'
      },
      {
        id: `LO-152-out-${date}`,
        flightNumber: 'LO 152',
        airlineCode: 'LO',
        airlineName: AIRLINES.LO.name,
        departureTime: '05:20',
        arrivalTime: '09:10',
        duration: '3h 50m',
        price: Math.round((210 + dateOffset) * dateFactor),
        cabinClass: 'Economy',
        stops: 'Direct',
        planeType: 'Boeing 737 MAX 8',
        terminal: 'TLV T3 → KRK T1',
        baggage: '1 carry-on (8kg) + 1 personal item included',
        reliability: '96% On-Time',
        seatsRemaining: 9,
        direction: 'outbound',
        origin: 'TLV',
        destination: 'KRK'
      },
      {
        id: `FR-2596-out-${date}`,
        flightNumber: 'FR 2596',
        airlineCode: 'FR',
        airlineName: AIRLINES.FR.name,
        departureTime: '21:30',
        arrivalTime: '01:15',
        duration: '3h 45m',
        price: Math.round((110 + dateOffset) * dateFactor),
        cabinClass: 'Economy',
        stops: 'Direct',
        planeType: 'Boeing 737-800',
        terminal: 'TLV T1 → KRK T1',
        baggage: '1 small personal bag included',
        reliability: '88% On-Time',
        seatsRemaining: 2,
        direction: 'outbound',
        origin: 'TLV',
        destination: 'KRK'
      },
      {
        id: `LY-5121-out-${date}`,
        flightNumber: 'LY 5121',
        airlineCode: 'LY',
        airlineName: AIRLINES.LY.name,
        departureTime: '08:00',
        arrivalTime: '11:55',
        duration: '3h 55m',
        price: Math.round((260 + dateOffset) * dateFactor),
        cabinClass: 'Economy Premium',
        stops: 'Direct',
        planeType: 'Boeing 737-900ER',
        terminal: 'TLV T3 → KRK T1',
        baggage: '1 checked bag (23kg) + 1 carry-on (8kg) included',
        reliability: '95% On-Time',
        seatsRemaining: 7,
        direction: 'outbound',
        origin: 'TLV',
        destination: 'KRK'
      }
    ];
  });

  // 2. RETURN (KRK -> TLV)
  returnDates.forEach((date) => {
    const dayOfWeek = new Date(date).getDay();
    const dateFactor = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6 ? 1.25 : 1.0;
    const dateOffset = (new Date(date).getDate() - 16) * 3.5; // August 16 is baseline

    database.return[date] = [
      {
        id: `W6-5121-ret-${date}`,
        flightNumber: 'W6 5121',
        airlineCode: 'W6',
        airlineName: AIRLINES.W6.name,
        departureTime: '06:15',
        arrivalTime: '10:00',
        duration: '3h 45m',
        price: Math.round((145 + dateOffset) * dateFactor),
        cabinClass: 'Economy',
        stops: 'Direct',
        planeType: 'Airbus A321neo',
        terminal: 'KRK T1 → TLV T3',
        baggage: '1 personal item (40x30x20cm) included',
        reliability: '90% On-Time',
        seatsRemaining: 5,
        direction: 'return',
        origin: 'KRK',
        destination: 'TLV'
      },
      {
        id: `LO-151-ret-${date}`,
        flightNumber: 'LO 151',
        airlineCode: 'LO',
        airlineName: AIRLINES.LO.name,
        departureTime: '22:50',
        arrivalTime: '02:40',
        duration: '3h 50m',
        price: Math.round((215 + dateOffset) * dateFactor),
        cabinClass: 'Economy',
        stops: 'Direct',
        planeType: 'Boeing 737 MAX 8',
        terminal: 'KRK T1 → TLV T3',
        baggage: '1 carry-on (8kg) + 1 personal item included',
        reliability: '94% On-Time',
        seatsRemaining: 8,
        direction: 'return',
        origin: 'KRK',
        destination: 'TLV'
      },
      {
        id: `FR-2595-ret-${date}`,
        flightNumber: 'FR 2595',
        airlineCode: 'FR',
        airlineName: AIRLINES.FR.name,
        departureTime: '16:20',
        arrivalTime: '20:05',
        duration: '3h 45m',
        price: Math.round((115 + dateOffset) * dateFactor),
        cabinClass: 'Economy',
        stops: 'Direct',
        planeType: 'Boeing 737-800',
        terminal: 'KRK T1 → TLV T1',
        baggage: '1 small personal bag included',
        reliability: '89% On-Time',
        seatsRemaining: 3,
        direction: 'return',
        origin: 'KRK',
        destination: 'TLV'
      },
      {
        id: `LY-5122-ret-${date}`,
        flightNumber: 'LY 5122',
        airlineCode: 'LY',
        airlineName: AIRLINES.LY.name,
        departureTime: '13:10',
        arrivalTime: '17:05',
        duration: '3h 55m',
        price: Math.round((275 + dateOffset) * dateFactor),
        cabinClass: 'Economy Premium',
        stops: 'Direct',
        planeType: 'Boeing 737-900ER',
        terminal: 'KRK T1 → TLV T3',
        baggage: '1 checked bag (23kg) + 1 carry-on (8kg) included',
        reliability: '93% On-Time',
        seatsRemaining: 6,
        direction: 'return',
        origin: 'KRK',
        destination: 'TLV'
      }
    ];
  });

  return database;
};

// Generate price history (past 30 days) and prediction (next 7 days)
export const generatePriceHistory = (flightNumber, basePrice) => {
  const history = [];
  const predictions = [];
  const daysOfHistory = 30;
  const daysOfPrediction = 7;
  
  let seed = 0;
  for (let i = 0; i < flightNumber.length; i++) {
    seed += flightNumber.charCodeAt(i);
  }
  const lcg = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  let currentVal = basePrice * 0.75;
  for (let i = daysOfHistory; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const rand = lcg() - 0.45;
    const fluctuation = basePrice * 0.03 * rand;
    currentVal = currentVal + fluctuation;
    
    if (i < 5) {
      const weight = (5 - i) / 5;
      currentVal = currentVal * (1 - weight) + basePrice * weight;
    }
    
    history.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Math.round(currentVal)
    });
  }

  history[history.length - 1].price = basePrice;

  let predVal = basePrice;
  const trendStrength = lcg() > 0.3 ? 0.04 : -0.01;

  for (let i = 1; i <= daysOfPrediction; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    const rand = lcg() - 0.3;
    const change = basePrice * trendStrength * rand;
    predVal = predVal + change;

    predictions.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Math.round(predVal)
    });
  }

  let advice = 'HOLD';
  let adviceDetails = 'Prices are fluctuating but stable. Watch for drops.';
  
  const lastHistoryPrice = history[history.length - 1].price;
  const startHistoryPrice = history[0].price;
  const avgPredPrice = predictions.reduce((sum, item) => sum + item.price, 0) / daysOfPrediction;

  if (avgPredPrice > lastHistoryPrice * 1.05) {
    advice = 'BUY NOW';
    adviceDetails = 'Prices are projected to increase by 5-15% as seat availability shrinks.';
  } else if (lastHistoryPrice < startHistoryPrice * 0.95 || avgPredPrice < lastHistoryPrice * 0.95) {
    advice = 'WAIT';
    adviceDetails = 'Prices are currently lower than average or expected to dip in the coming days.';
  } else {
    advice = 'BUY NOW';
    adviceDetails = 'August is peak holiday season. Prices are unlikely to drop further.';
  }

  return { history, predictions, advice, adviceDetails };
};

// Interpolate coordinates along the Great Circle (geodesic path)
// isOutbound specifies if flight is TLV -> KRK (true) or KRK -> TLV (false)
export const getFlightTelemetry = (progress, isOutbound = true) => {
  const [lat1, lon1] = isOutbound ? TLV_COORDS : KRK_COORDS;
  const [lat2, lon2] = isOutbound ? KRK_COORDS : TLV_COORDS;
  
  const rLat1 = (lat1 * Math.PI) / 180;
  const rLon1 = (lon1 * Math.PI) / 180;
  const rLat2 = (lat2 * Math.PI) / 180;
  const rLon2 = (lon2 * Math.PI) / 180;

  const d = 2 * Math.asin(
    Math.sqrt(
      Math.sin((rLat1 - rLat2) / 2) ** 2 +
      Math.cos(rLat1) * Math.cos(rLat2) * Math.sin((rLon1 - rLon2) / 2) ** 2
    )
  );

  let lat, lon;

  if (progress <= 0) {
    lat = lat1;
    lon = lon1;
  } else if (progress >= 1) {
    lat = lat2;
    lon = lon2;
  } else {
    const A = Math.sin((1 - progress) * d) / Math.sin(d);
    const B = Math.sin(progress * d) / Math.sin(d);
    const x = A * Math.cos(rLat1) * Math.cos(rLon1) + B * Math.cos(rLat2) * Math.cos(rLon2);
    const y = A * Math.cos(rLat1) * Math.sin(rLon1) + B * Math.cos(rLat2) * Math.sin(rLon2);
    const z = A * Math.sin(rLat1) + B * Math.sin(rLat2);
    
    lat = (Math.atan2(z, Math.sqrt(x ** 2 + y ** 2)) * 180) / Math.PI;
    lon = (Math.atan2(y, x) * 180) / Math.PI;
  }

  const yBearing = Math.sin(rLon2 - rLon1) * Math.cos(rLat2);
  const xBearing = Math.cos(rLat1) * Math.sin(rLat2) - Math.sin(rLat1) * Math.cos(rLat2) * Math.cos(rLon2 - rLon1);
  let heading = (Math.atan2(yBearing, xBearing) * 180) / Math.PI;
  heading = (heading + 360) % 360;

  let altitude = 0;
  let speed = 0;
  let status = 'Scheduled';

  if (progress <= 0) {
    status = 'Boarding';
    altitude = 0;
    speed = 0;
  } else if (progress < 0.08) {
    status = 'Takeoff';
    altitude = Math.round(progress * 12.5 * 36000);
    speed = Math.round(250 + progress * 12.5 * 550);
  } else if (progress >= 0.08 && progress < 0.88) {
    status = 'In Flight';
    altitude = 36000 + Math.round(Math.sin(progress * Math.PI * 10) * 400);
    speed = 820 + Math.round(Math.sin(progress * Math.PI * 5) * 15);
  } else if (progress >= 0.88 && progress < 0.99) {
    status = 'Descending';
    const descentProg = (0.99 - progress) / (0.99 - 0.88);
    altitude = Math.round(descentProg * 36000);
    speed = Math.round(200 + descentProg * 620);
  } else {
    status = 'Landed';
    altitude = isOutbound ? 780 : 135; // KRK elevation: ~780ft, TLV elevation: ~135ft
    speed = 0;
  }

  const totalDistance = 2440; // km
  const distanceCovered = Math.round(totalDistance * progress);
  const distanceRemaining = Math.max(0, totalDistance - distanceCovered);

  const totalMinutes = 230;
  const timeRemaining = Math.max(0, Math.round(totalMinutes * (1 - progress)));

  return {
    latitude: lat,
    longitude: lon,
    heading: Math.round(heading),
    altitude,
    speed,
    status,
    progress: Math.round(progress * 100),
    distanceCovered,
    distanceRemaining,
    timeRemaining
  };
};

// Generate deep search URL for Skyscanner based on route and date
// Date format: YYYY-MM-DD
export const getSkyscannerUrl = (origin, destination, dateStr) => {
  if (!dateStr) return 'https://www.skyscanner.com';
  // Parse date into YYMMDD
  const parts = dateStr.split('-');
  if (parts.length !== 3) return 'https://www.skyscanner.com';
  const yy = parts[0].slice(-2);
  const mm = parts[1];
  const dd = parts[2];
  const dateFormatted = `${yy}${mm}${dd}`;
  
  return `https://www.skyscanner.com/transport/flights/${origin.toLowerCase()}/${destination.toLowerCase()}/${dateFormatted}/`;
};
