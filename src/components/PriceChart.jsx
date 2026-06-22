import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { generatePriceHistory } from '../utils/flightSimulator';
import { TrendingUp, Info, AlertCircle } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PriceChart({ activeFlight }) {
  const { history, predictions, advice, adviceDetails } = generatePriceHistory(
    activeFlight.flightNumber,
    activeFlight.price
  );

  // Combine history and prediction labels
  const allLabels = [
    ...history.map(item => item.date),
    ...predictions.map(item => item.date)
  ];

  // Align datasets: History stops at today, Prediction starts at today (connecting point) and goes forward
  const historyData = [
    ...history.map(item => item.price),
    ...Array(predictions.length).fill(null)
  ];

  const predictionData = [
    ...Array(history.length - 1).fill(null),
    history[history.length - 1].price, // connect prediction line to history last point
    ...predictions.map(item => item.price)
  ];

  const data = {
    labels: allLabels,
    datasets: [
      {
        label: 'Historical Price ($)',
        data: historyData,
        borderColor: '#00f2fe',
        backgroundColor: 'rgba(0, 242, 254, 0.06)',
        borderWidth: 2.5,
        pointBackgroundColor: '#00f2fe',
        pointBorderColor: '#0b0f19',
        pointBorderWidth: 1.5,
        pointRadius: (context) => {
          // Highlight first, current, and last points
          const index = context.dataIndex;
          return index === 0 || index === history.length - 1 ? 5 : 0;
        },
        pointHoverRadius: 6,
        fill: true,
        spanGaps: false,
        tension: 0.3
      },
      {
        label: 'Predicted Price ($)',
        data: predictionData,
        borderColor: '#a18cd1',
        backgroundColor: 'rgba(161, 140, 209, 0.04)',
        borderWidth: 2.5,
        borderDash: [5, 5],
        pointBackgroundColor: '#a18cd1',
        pointBorderColor: '#0b0f19',
        pointBorderWidth: 1.5,
        pointRadius: (context) => {
          const index = context.dataIndex;
          return index === allLabels.length - 1 ? 5 : 0;
        },
        pointHoverRadius: 6,
        fill: true,
        spanGaps: true,
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false // We will render a custom HTML legend
      },
      tooltip: {
        backgroundColor: '#121826',
        titleColor: '#f8fafc',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        usePointStyle: true,
        callbacks: {
          label: (context) => ` Price: $${context.parsed.y}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 10,
            family: 'Outfit'
          },
          maxTicksLimit: 8
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)'
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 10,
            family: 'Outfit'
          },
          callback: (value) => `$${value}`
        }
      }
    }
  };

  // Stats calculation
  const currentPrice = activeFlight.price;
  const startPrice = history[0].price;
  const minPrice = Math.min(...history.map(item => item.price));
  const maxPrice = Math.max(...history.map(item => item.price));
  const percentChange = Math.round(((currentPrice - startPrice) / startPrice) * 100);

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Chart Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
            Price History & Analytics
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            30-day tracking and 7-day predictive analytics
          </p>
        </div>

        {/* Custom Legend */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '3px', backgroundColor: '#00f2fe', borderRadius: '1px' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>History</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '3px', borderTop: '2px dashed #a18cd1', borderRadius: '1px' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>Prediction</span>
          </div>
        </div>
      </div>

      {/* Booking Advice Banner */}
      <div style={{
        background: advice === 'BUY NOW' ? 'rgba(5, 150, 105, 0.1)' : advice === 'WAIT' ? 'rgba(217, 119, 6, 0.1)' : 'rgba(148, 163, 184, 0.08)',
        border: `1px solid ${advice === 'BUY NOW' ? 'rgba(5, 150, 105, 0.3)' : advice === 'WAIT' ? 'rgba(217, 119, 6, 0.3)' : 'var(--border-glass)'}`,
        borderRadius: 'var(--radius-sm)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <div style={{
          backgroundColor: advice === 'BUY NOW' ? 'var(--success)' : advice === 'WAIT' ? 'var(--warning)' : 'var(--text-muted)',
          color: '#0b0f19',
          fontWeight: 800,
          fontSize: '0.75rem',
          padding: '4px 10px',
          borderRadius: '4px',
          textTransform: 'uppercase',
          marginTop: '2px'
        }}>
          {advice}
        </div>
        <div style={{ flexGrow: 1 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Recommendation Details
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {adviceDetails}
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div style={{ height: '220px', width: '100%', position: 'relative' }}>
        <Line data={data} options={options} />
      </div>

      {/* Stat Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        borderTop: '1px solid var(--border-glass)',
        paddingTop: '16px',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Current Price</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            ${currentPrice}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Lowest Price</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#34d399', marginTop: '2px' }}>
            ${minPrice}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Highest Price</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f87171', marginTop: '2px' }}>
            ${maxPrice}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>30D Trend</div>
          <div style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: percentChange >= 0 ? '#f87171' : '#34d399',
            marginTop: '2px'
          }}>
            {percentChange >= 0 ? `+${percentChange}%` : `${percentChange}%`}
          </div>
        </div>
      </div>
      
    </div>
  );
}
