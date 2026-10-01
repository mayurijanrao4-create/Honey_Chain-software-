import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Thermometer,
  Droplets,
  Scale,
  BatteryCharging,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Play,
  Pause,
  RefreshCw,
} from 'lucide-react';
import { honeyChainStore } from '../services/dataStore';
import { Hive, SensorThresholds, Alert } from '../types';

export const SmartMonitoringView: React.FC = () => {
  const [hives, setHives] = useState<Hive[]>(honeyChainStore.getHives());
  const [selectedHiveId, setSelectedHiveId] = useState<string>(hives[0]?.id || 'HIVE-101');
  const [thresholds, setThresholds] = useState<SensorThresholds>(honeyChainStore.getSensorThresholds());
  const [alerts, setAlerts] = useState<Alert[]>(honeyChainStore.getAlerts());
  const [isSimulating, setIsSimulating] = useState(true);
  const [activeChartMetric, setActiveChartMetric] = useState<'temp' | 'weight' | 'humidity'>('temp');

  useEffect(() => {
    return honeyChainStore.subscribe(() => {
      setHives([...honeyChainStore.getHives()]);
      setThresholds({ ...honeyChainStore.getSensorThresholds() });
      setAlerts([...honeyChainStore.getAlerts()]);
    });
  }, []);

  // Real-time IoT background ticker
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      honeyChainStore.simulateIoTTick();
    }, 4000);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const selectedHive = hives.find((h) => h.id === selectedHiveId) || hives[0];
  const reading = selectedHive?.latestSensorReading;

  // Generate 24-hour historical trend points
  const generateTrendData = () => {
    const points = [];
    const now = new Date();
    for (let i = 24; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hour = time.getHours();
      // Natural diurnal variation
      const tempVar = Math.sin((hour - 8) / 3.8) * 1.5;
      const weightVar = Math.sin((hour - 12) / 4) * 0.4;
      const humidityVar = -Math.sin((hour - 8) / 3.8) * 6;

      const baseInternalTemp = reading?.internalTempC || 34.8;
      const baseWeight = reading?.weightKg || 46.5;
      const baseHumidity = reading?.humidityPercent || 58.0;

      points.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        internalTemp: +(baseInternalTemp + tempVar + (Math.random() - 0.5) * 0.2).toFixed(1),
        ambientTemp: +(24 + Math.sin((hour - 8) / 3.8) * 5 + (Math.random() - 0.5) * 0.4).toFixed(1),
        weight: +(baseWeight + weightVar).toFixed(2),
        humidity: +(baseHumidity + humidityVar).toFixed(1),
      });
    }
    return points;
  };

  const trendData = generateTrendData();

  const handleResolveAlert = (alertId: string) => {
    honeyChainStore.resolveAlert(alertId, 'Verified and calibrated by beekeeper.');
  };

  const hiveAlerts = alerts.filter((a) => a.hiveId === selectedHive?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Banner */}
      <div className="bg-stone-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Smart Beekeeping & IoT Hive Scale Network</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            Smart Hive Telemetry Monitor
          </h1>
          <p className="text-stone-400 text-sm max-w-xl">
            Real-time simulated multi-sensor telemetry tracking brood core temperature, acoustic colony activity,
            load cell weight, and environmental micro-climate.
          </p>
        </div>

        {/* Live Simulation Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-2 ${
              isSimulating
                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isSimulating ? 'Live IoT Stream (Active)' : 'Resume IoT Stream'}</span>
          </button>
          <button
            onClick={() => honeyChainStore.simulateIoTTick()}
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 cursor-pointer"
            title="Force sensor tick"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hive Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-semibold text-stone-500 shrink-0">Select Smart Hive:</span>
        {hives.map((h) => {
          const isSelected = h.id === selectedHiveId;
          const hasAlert = alerts.some((a) => a.hiveId === h.id && a.status === 'active');
          return (
            <button
              key={h.id}
              onClick={() => setSelectedHiveId(h.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
                isSelected
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200'
              }`}
            >
              <span>{h.hiveCode}</span>
              <span className="text-[11px] opacity-75 font-normal">({h.apiaryName.split(' ')[0]})</span>
              {hasAlert && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>}
            </button>
          );
        })}
      </div>

      {/* Live Sensor Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Metric 1: Brood Nest Temp */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-semibold">Brood Core Temp</span>
            <Thermometer className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-stone-900 font-mono">
              {reading?.internalTempC || '--'}
            </span>
            <span className="text-xs text-stone-500">°C</span>
          </div>
          <div className="text-[10px] text-stone-400">
            Optimal: 34.5°C - 35.5°C
          </div>
        </div>

        {/* Metric 2: Ambient Temp */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-semibold">Ambient Temp</span>
            <Thermometer className="w-4 h-4 text-orange-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-stone-900 font-mono">
              {reading?.ambientTempC || '--'}
            </span>
            <span className="text-xs text-stone-500">°C</span>
          </div>
          <div className="text-[10px] text-stone-400">Outdoor Apiary Sensor</div>
        </div>

        {/* Metric 3: Relative Humidity */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-semibold">Hive Humidity</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-stone-900 font-mono">
              {reading?.humidityPercent || '--'}
            </span>
            <span className="text-xs text-stone-500">%</span>
          </div>
          <div className="text-[10px] text-stone-400">Optimal: 50% - 65%</div>
        </div>

        {/* Metric 4: Scale Gross Weight */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-semibold">Hive Gross Weight</span>
            <Scale className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-stone-900 font-mono">
              {reading?.weightKg || '--'}
            </span>
            <span className="text-xs text-stone-500">kg</span>
          </div>
          <div className="text-[10px] text-stone-400">Precision load-cell scale</div>
        </div>

        {/* Metric 5: Acoustic Frequency */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-semibold">Colony Acoustic</span>
            <Activity className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-stone-900 font-mono">
              {reading?.audioFrequencyHz || '--'}
            </span>
            <span className="text-xs text-stone-500">Hz</span>
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold capitalize">
            {reading?.activityLevel || 'Normal'}
          </div>
        </div>

        {/* Metric 6: Solar Battery */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[11px] font-semibold">Solar Battery</span>
            <BatteryCharging className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-stone-900 font-mono">
              {reading?.batteryLevelPercent || '--'}
            </span>
            <span className="text-xs text-stone-500">%</span>
          </div>
          <div className="text-[10px] text-stone-400">Solar cell charged</div>
        </div>
      </div>

      {/* Main Visual: Historical Telemetry SVG Trend Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <h2 className="font-display text-xl font-bold text-stone-900">
              24-Hour Telemetry Trends ({selectedHive.hiveCode})
            </h2>
            <p className="text-xs text-stone-500">
              Continuous sensor data curve showing environmental adjustments and nectar load shifts.
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
            <button
              onClick={() => setActiveChartMetric('temp')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeChartMetric === 'temp'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Temperature (°C)
            </button>
            <button
              onClick={() => setActiveChartMetric('weight')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeChartMetric === 'weight'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Weight (kg)
            </button>
            <button
              onClick={() => setActiveChartMetric('humidity')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeChartMetric === 'humidity'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Humidity (%)
            </button>
          </div>
        </div>

        {/* Render Crisp Interactive SVG Chart */}
        <div className="h-64 sm:h-72 w-full relative">
          <svg viewBox="0 0 800 240" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[40, 90, 140, 190].map((y, i) => (
              <line
                key={i}
                x1="40"
                y1={y}
                x2="780"
                y2={y}
                stroke="#f3f4f6"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}

            {/* Data calculation for active metric */}
            {(() => {
              const dataValues = trendData.map((d) => {
                if (activeChartMetric === 'temp') return d.internalTemp;
                if (activeChartMetric === 'weight') return d.weight;
                return d.humidity;
              });

              const minVal = Math.min(...dataValues) * 0.95;
              const maxVal = Math.max(...dataValues) * 1.05;
              const range = maxVal - minVal || 1;

              const points = trendData.map((d, idx) => {
                const val =
                  activeChartMetric === 'temp'
                    ? d.internalTemp
                    : activeChartMetric === 'weight'
                    ? d.weight
                    : d.humidity;
                const x = 50 + (idx / (trendData.length - 1)) * 720;
                const y = 200 - ((val - minVal) / range) * 160;
                return { x, y, val, time: d.time };
              });

              const pathString = points.reduce(
                (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
                ''
              );
              const areaString = `${pathString} L ${points[points.length - 1].x} 200 L ${points[0].x} 200 Z`;

              return (
                <>
                  <path d={areaString} fill="url(#chartGradient)" />
                  <path
                    d={pathString}
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {points.map((p, i) => (
                    <g key={i} className="group cursor-pointer">
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="3.5"
                        fill="#ffffff"
                        stroke="#d97706"
                        strokeWidth="2"
                        className="hover:r-5 transition-all"
                      />
                      {/* X Axis Time Labels */}
                      {i % 4 === 0 && (
                        <text
                          x={p.x}
                          y="225"
                          textAnchor="middle"
                          className="text-[10px] fill-stone-400 font-mono"
                        >
                          {p.time}
                        </text>
                      )}
                    </g>
                  ))}
                </>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* Threshold Configurator & Active Alerts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Configurable Thresholds */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-4">
            <Sliders className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="font-display text-lg font-bold text-stone-900">
                IoT Threshold Alarm Settings
              </h3>
              <p className="text-xs text-stone-500">
                Trigger automated notifications if colony parameters cross safe operational limits.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Maximum Internal Core Temperature</span>
                <span className="font-mono text-amber-700">{thresholds.maxInternalTempC}°C</span>
              </div>
              <input
                type="range"
                min="34.0"
                max="39.0"
                step="0.1"
                value={thresholds.maxInternalTempC}
                onChange={(e) =>
                  honeyChainStore.updateThresholds({ maxInternalTempC: parseFloat(e.target.value) })
                }
                className="w-full accent-amber-500"
              />
              <span className="text-[10px] text-stone-400">Triggers heat stress warning above 36.5°C</span>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Minimum Hive Relative Humidity</span>
                <span className="font-mono text-blue-700">{thresholds.minHumidityPercent}%</span>
              </div>
              <input
                type="range"
                min="35"
                max="60"
                step="1"
                value={thresholds.minHumidityPercent}
                onChange={(e) =>
                  honeyChainStore.updateThresholds({ minHumidityPercent: parseFloat(e.target.value) })
                }
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Sudden Weight Drop Trigger (Swarm/Theft)</span>
                <span className="font-mono text-emerald-700">{thresholds.weightDropAlertKg} kg</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="8.0"
                step="0.5"
                value={thresholds.weightDropAlertKg}
                onChange={(e) =>
                  honeyChainStore.updateThresholds({ weightDropAlertKg: parseFloat(e.target.value) })
                }
                className="w-full accent-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Right: Live Alerts List for this Hive */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="font-display text-lg font-bold text-stone-900">
                  Colony Diagnostic Alerts
                </h3>
                <p className="text-xs text-stone-500">Active alerts logged for {selectedHive.hiveCode}.</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
              {hiveAlerts.length} Recorded
            </span>
          </div>

          <div className="space-y-3">
            {hiveAlerts.length === 0 ? (
              <div className="text-center py-8 text-stone-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                All environmental parameters within nominal thresholds.
              </div>
            ) : (
              hiveAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className={`p-4 rounded-2xl border text-xs space-y-2 ${
                    alt.status === 'resolved'
                      ? 'bg-stone-50 border-stone-200 text-stone-600'
                      : alt.severity === 'critical'
                      ? 'bg-rose-50 border-rose-200 text-rose-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-[10px]">
                      {alt.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {new Date(alt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="leading-relaxed">{alt.message}</p>
                  {alt.status === 'active' ? (
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => handleResolveAlert(alt.id)}
                        className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                      >
                        Acknowledge & Resolve
                      </button>
                    </div>
                  ) : (
                    <div className="text-[11px] text-stone-500 italic">
                      Resolved: {alt.actionTaken}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
