# AeroTrack ✈️ (Premium Flight Tracker & Price Engine)

**AeroTrack** is a modern, high-fidelity Flight Tracker and Ticketing Analytics web application. It is pre-configured to track flights between **Tel Aviv (TLV)** and **Krakow (KRK)**, helping travelers monitor outbound routes (August 11), return routes (August 16), price trends, and live flight simulator HUDs.

---

## Key Features

*   **📍 Live Telemetry Map HUD**: Uses an interactive, dark-themed Leaflet map showing the geodesic route (great-circle path) between Ben Gurion Airport and Krakow John Paul II Airport. Renders a glowing plane marker that rotates dynamically to point in the direction of the flight heading.
*   **📊 Price History & Projections**: Incorporates a smooth line chart visualizing 30 days of historical ticket pricing paired with a 7-day predictive projection.
*   **💡 Dynamic Market Recommendations**: Computes market curves to deliver smart booking advice: **BUY NOW**, **WAIT**, or **HOLD**.
*   **🌐 Skyscanner Aggregator**: Integrates Skyscanner search capabilities directly. A Skyscanner badge in the dashboard and search banner in the calendar let you search Skyscanner for current flight schedules in one click.
*   **📅 Surrounding Date Calendar**: Interactive calendar strips representing surrounding dates (Aug 8–15 outbound, Aug 13–20 return) showing minimum fares for easy comparisons.
*   **🔔 Custom Alerts Center**: Set alert triggers for specific price drop thresholds or flight status updates, and view events in a live notifications log.
*   **⏱️ Live Telemetry Simulator**: Control speed multipliers (1x, 5x, 20x) or drag the slider manually to run a fast-forward flight telemetry check (Scheduled → Boarding → Takeoff → Cruising → Descending → Landed).

---

## Tech Stack

*   **Core**: React + Vite (Fast HMR & build setups)
*   **Styling**: Custom CSS variables, glassmorphic layout cards, custom scrollbars, and neon glows.
*   **Maps**: [Leaflet.js](https://leafletjs.com/) (using CartoDB Dark Matter tile layer)
*   **Charts**: [Chart.js](https://www.chartjs.org/) + [React Chartjs 2](https://react-chartjs-2.js.org/)
*   **Icons**: [Lucide React](https://lucide.dev/)

---

## Getting Started

Follow these steps to run the flight tracker locally:

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (which includes `npm`).

### 2. Installation
Navigate to your project directory and install the dependencies:
```bash
# Navigate to the folder
cd flight-tracker

# Install packages
npm install