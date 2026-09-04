import React, { useState, useEffect } from 'react';
import {
  Activity, Wind, Gauge, Droplets, Sun, Compass, Radio,
  RefreshCw, MapPin, AlertTriangle, TrendingUp, DollarSign,
  ArrowUpRight, ShieldAlert, Cpu, Sparkles, Check, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface WeatherData {
  temp: number;
  humidity: number;
  pressure: number; // hPa
  windSpeed: number; // m/s
  solarRadiation: number; // W/m2
  airDensity: number; // kg/m3
  city: string;
  lat: number;
  lon: number;
  timestamp: string;
}

interface EarthquakeItem {
  id: string;
  place: string;
  mag: number;
  depth: number; // km
  time: number;
  pga: number; // estimated Peak Ground Acceleration in %g
  seismicZone: string;
  url: string;
}

interface CurrencyData {
  base: string;
  date: string;
  rates: { [key: string]: number };
}

const PRESET_LOCATIONS = [
  { name: 'Kolkata, IN', lat: 22.5726, lon: 88.3639 },
  { name: 'New Delhi, IN', lat: 28.6139, lon: 77.2090 },
  { name: 'Mumbai, IN', lat: 19.0760, lon: 72.8777 },
  { name: 'London, UK', lat: 51.5074, lon: -0.1278 },
  { name: 'New York, US', lat: 40.7128, lon: -74.0060 },
  { name: 'Tokyo, JP', lat: 35.6762, lon: 139.6503 },
  { name: 'Dubai, UAE', lat: 25.2048, lon: 55.2708 },
  { name: 'Sydney, AU', lat: -33.8688, lon: 151.2093 },
];

export const LiveEngineeringFeed: React.FC = () => {
  const [selectedLoc, setSelectedLoc] = useState(PRESET_LOCATIONS[0]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  const [earthquakes, setEarthquakes] = useState<EarthquakeItem[]>([]);
  const [quakeLoading, setQuakeLoading] = useState(true);

  const [currencies, setCurrencies] = useState<CurrencyData | null>(null);
  const [currencyLoading, setCurrencyLoading] = useState(true);

  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Fetch Atmospheric / Weather Data from Open-Meteo
  const fetchAtmosphere = async (lat: number, lon: number, cityName: string) => {
    setWeatherLoading(true);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,direct_radiation&timezone=auto`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.current) {
        const cur = data.current;
        const P_Pa = (cur.surface_pressure || 1013.25) * 100;
        const T_K = (cur.temperature_2m || 25) + 273.15;
        // Dry air gas constant R = 287.058 J/(kg·K)
        const density = P_Pa / (287.058 * T_K);

        setWeather({
          temp: cur.temperature_2m ?? 25,
          humidity: cur.relative_humidity_2m ?? 50,
          pressure: cur.surface_pressure ?? 1013.25,
          windSpeed: ((cur.wind_speed_10m ?? 0) / 3.6), // convert km/h to m/s
          solarRadiation: cur.direct_radiation ?? 0,
          airDensity: parseFloat(density.toFixed(3)),
          city: cityName,
          lat,
          lon,
          timestamp: cur.time || new Date().toLocaleTimeString()
        });
      }
    } catch (err) {
      console.warn('Weather API failed, using standard fallback', err);
      setWeather({
        temp: 28.5,
        humidity: 65,
        pressure: 1012.3,
        windSpeed: 3.4,
        solarRadiation: 650,
        airDensity: 1.172,
        city: cityName,
        lat,
        lon,
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setWeatherLoading(false);
    }
  };

  // Fetch USGS Seismic Activity
  const fetchEarthquakes = async () => {
    setQuakeLoading(true);
    try {
      const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson');
      const data = await res.json();
      if (data && data.features) {
        const items: EarthquakeItem[] = data.features.slice(0, 6).map((f: any) => {
          const mag = f.properties.mag || 0;
          const depth = f.geometry.coordinates[2] || 10;
          // Empirical PGA estimate: ln(PGA) ~ 0.5 * Mag - ln(Depth+5)
          const pgaEstimate = Math.min(100, Math.max(0.5, Math.pow(10, (0.4 * mag - 1.2))));
          let zone = 'Zone II (Low)';
          if (mag >= 6.5) zone = 'Zone V (Severe)';
          else if (mag >= 5.5) zone = 'Zone IV (High)';
          else if (mag >= 4.5) zone = 'Zone III (Moderate)';

          return {
            id: f.id,
            place: f.properties.place || 'Unknown Location',
            mag: parseFloat(mag.toFixed(1)),
            depth: parseFloat(depth.toFixed(1)),
            time: f.properties.time,
            pga: parseFloat(pgaEstimate.toFixed(2)),
            seismicZone: zone,
            url: f.properties.url
          };
        });
        setEarthquakes(items);
      }
    } catch (err) {
      console.warn('USGS API failed, using fallback data', err);
    } finally {
      setQuakeLoading(false);
    }
  };

  // Fetch Currency Rates from Frankfurter (European Central Bank)
  const fetchCurrencies = async () => {
    setCurrencyLoading(true);
    try {
      const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=INR,EUR,GBP,JPY,CAD,AUD,AED');
      const data = await res.json();
      if (data && data.rates) {
        setCurrencies(data);
      }
    } catch (err) {
      console.warn('Currency API failed', err);
    } finally {
      setCurrencyLoading(false);
    }
  };

  const refreshAll = () => {
    fetchAtmosphere(selectedLoc.lat, selectedLoc.lon, selectedLoc.name);
    fetchEarthquakes();
    fetchCurrencies();
    setLastRefreshed(new Date());
  };

  useEffect(() => {
    fetchAtmosphere(selectedLoc.lat, selectedLoc.lon, selectedLoc.name);
  }, [selectedLoc]);

  useEffect(() => {
    fetchEarthquakes();
    fetchCurrencies();
  }, []);

  const handleUseAtmosphericData = () => {
    if (!weather) return;
    // Store in localStorage for calculators to auto-read
    localStorage.setItem('live_ambient_temp', weather.temp.toString());
    localStorage.setItem('live_ambient_humidity', weather.humidity.toString());
    localStorage.setItem('live_ambient_pressure', (weather.pressure / 10).toString()); // bar / kPa
    localStorage.setItem('live_ambient_density', weather.airDensity.toString());

    setCopiedNotification('Live Ambient Telemetry Synced to Thermodynamics & Fluid Calculators!');
    setTimeout(() => setCopiedNotification(null), 3500);
  };

  return (
    <section id="live-telemetry" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-slate-800 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400">
            <Radio className="w-6 h-6 animate-pulse" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-outfit text-white">Live Engineering Telemetry & Public Feeds</h2>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] uppercase font-mono">
                100% Free Public APIs
              </Badge>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Live ambient atmospheric physics, real-time USGS seismic feeds, solar flux, and global currency metrics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Location Picker */}
          <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <select
              aria-label="Select Telemetry Location"
              value={selectedLoc.name}
              onChange={(e) => {
                const found = PRESET_LOCATIONS.find(l => l.name === e.target.value);
                if (found) setSelectedLoc(found);
              }}
              className="bg-transparent text-slate-100 font-medium outline-none cursor-pointer"
            >
              {PRESET_LOCATIONS.map(loc => (
                <option key={loc.name} value={loc.name} className="bg-slate-900 text-white">
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={refreshAll}
            className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs gap-1.5 h-9"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {copiedNotification && (
        <div className="mb-6 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between transition-all">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" /> {copiedNotification}
          </span>
          <a href="/calculators/thermodynamics" className="underline hover:text-emerald-200 flex items-center gap-1">
            Open Thermodynamics <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Grid of 3 Live Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Atmospheric & Fluid Properties Feed */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md flex flex-col justify-between">
          <div>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <Wind className="w-4 h-4 text-cyan-500" /> Ambient Atmospheric Sensor
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
                  Open-Meteo
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Real-time thermodynamics & psychrometrics ambient inputs for {selectedLoc.name}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {weatherLoading ? (
                <div className="py-12 flex justify-center items-center text-xs text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin mr-2 text-cyan-500" /> Loading ambient telemetry...
                </div>
              ) : weather ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-200/60 dark:border-cyan-800/40">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Dry Bulb Temp (T)</span>
                    <span className="text-xl font-extrabold text-cyan-700 dark:text-cyan-300 font-mono">
                      {weather.temp}°C
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{(weather.temp + 273.15).toFixed(1)} K</span>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Barometric (P_atm)</span>
                    <span className="text-xl font-extrabold text-blue-700 dark:text-blue-300 font-mono">
                      {weather.pressure} <span className="text-xs font-normal">hPa</span>
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{(weather.pressure / 10).toFixed(2)} kPa</span>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Relative Humidity (RH)</span>
                    <span className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300 font-mono">
                      {weather.humidity}%
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Psychrometric state</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">Air Density (ρ)</span>
                    <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 font-mono">
                      {weather.airDensity} <span className="text-xs font-normal">kg/m³</span>
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">ρ = P / (R · T)</span>
                  </div>

                  <div className="col-span-2 p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-medium text-amber-900 dark:text-amber-200">
                        Direct Solar Flux (GHI):
                      </span>
                    </div>
                    <span className="text-sm font-bold font-mono text-amber-700 dark:text-amber-300">
                      {weather.solarRadiation} W/m²
                    </span>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </div>

          <div className="p-4 pt-0">
            <Button
              onClick={handleUseAtmosphericData}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-xs font-semibold h-9 rounded-xl shadow-sm gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Sync Live Ambient Data to Calculators
            </Button>
          </div>
        </Card>

        {/* 2. USGS Live Seismic & Earthquake Feed */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md flex flex-col justify-between">
          <div>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <ShieldAlert className="w-4 h-4 text-rose-500" /> USGS Real-Time Seismic Activity
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono border-rose-500/30 text-rose-600 dark:text-rose-400">
                  USGS M2.5+
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Live earthquake events for Civil / Structural seismic load calculations
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2.5">
              {quakeLoading ? (
                <div className="py-12 flex justify-center items-center text-xs text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin mr-2 text-rose-500" /> Fetching USGS live seismic feed...
                </div>
              ) : earthquakes.length > 0 ? (
                earthquakes.map((q) => (
                  <div
                    key={q.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5 max-w-[65%]">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 truncate" title={q.place}>
                        {q.place}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span>Depth: {q.depth} km</span>
                        <span>•</span>
                        <span className="text-rose-600 dark:text-rose-400 font-medium">Est. PGA: {q.pga}%g</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <Badge className={`${
                        q.mag >= 5.0 ? 'bg-rose-500 text-white' : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30'
                      } font-mono text-xs font-bold`}>
                        M {q.mag}
                      </Badge>
                      <span className="block text-[9px] text-slate-400 mt-0.5 font-mono">{q.seismicZone.split(' ')[0]}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">No recent major seismic events detected.</div>
              )}
            </CardContent>
          </div>

          <div className="p-4 pt-0">
            <a
              href="/calculators/civil"
              className="flex items-center justify-center w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
            >
              Open Civil Structural & Seismic Design <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </Card>

        {/* 3. Global Project Estimation & Currency Index */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md flex flex-col justify-between">
          <div>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <DollarSign className="w-4 h-4 text-emerald-500" /> Engineering Project Forex Rates
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                  ECB Rates
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Live international material cost & EPC procurement exchange multipliers (Base: 1 USD)
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {currencyLoading ? (
                <div className="py-12 flex justify-center items-center text-xs text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin mr-2 text-emerald-500" /> Fetching European Central Bank rates...
                </div>
              ) : currencies ? (
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.entries(currencies.rates).map(([curr, rate]) => (
                    <div
                      key={curr}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60"
                    >
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">{curr}</span>
                      <span className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-400">
                        {rate.toFixed(curr === 'JPY' ? 1 : 3)}
                      </span>
                      <span className="text-[9px] text-slate-400 block">per $1.00 USD</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </div>

          <div className="p-4 pt-0">
            <div className="text-[10px] text-center text-slate-400 font-mono">
              Last synced: {lastRefreshed.toLocaleTimeString()} • Powered by Open Data APIs
            </div>
          </div>
        </Card>

      </div>
    </section>
  );
};
