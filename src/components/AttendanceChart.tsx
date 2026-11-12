import React, { useState } from 'react';
import { TrendingUp, Users, Calendar, Info } from 'lucide-react';
import { MonthlyAttendance } from '../types';

interface AttendanceChartProps {
  data: MonthlyAttendance[];
}

export const AttendanceChart: React.FC<AttendanceChartProps> = ({ data }) => {
  const [metricMode, setMetricMode] = useState<'rate' | 'count'>('rate');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(data.length - 1);

  // Chart layout dimensions
  const width = 640;
  const height = 220;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 35;

  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;

  // Determine Y-range based on mode
  const minVal = metricMode === 'rate' ? 85 : 45;
  const maxVal = metricMode === 'rate' ? 100 : 70;
  const valRange = maxVal - minVal;

  const points = data.map((d, i) => {
    const val = metricMode === 'rate' ? d.rate : d.present;
    const x = paddingLeft + (i / (data.length - 1)) * innerWidth;
    const normalizedY = (val - minVal) / valRange;
    const y = paddingTop + innerHeight - normalizedY * innerHeight;
    return { x, y, val, item: d };
  });

  // Construct SVG Path
  const pathD = points.reduce((acc, curr, index) => {
    if (index === 0) return `M ${curr.x} ${curr.y}`;
    // Catmull-Rom or smooth cubic bezier interpolation
    const prev = points[index - 1];
    const cpX1 = prev.x + (curr.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (curr.x - prev.x) / 2;
    const cpY2 = curr.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
  }, '');

  // Construct Area Path for gradient fill
  const areaD = `${pathD} L ${points[points.length - 1].x} ${
    paddingTop + innerHeight
  } L ${points[0].x} ${paddingTop + innerHeight} Z`;

  // Y-axis tick marks
  const yTicks = metricMode === 'rate' ? [85, 90, 95, 100] : [45, 50, 55, 60, 65, 70];

  // Averages and stats
  const avgRate = (
    data.reduce((acc, curr) => acc + curr.rate, 0) / data.length
  ).toFixed(1);

  const highestMonth = [...data].sort((a, b) => b.rate - a.rate)[0];

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 lg:p-6 shadow-xs">
      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              Tren Kehadiran Karyawan (6 Bulan Terakhir)
            </h2>
            <span className="text-xs text-slate-400">· Juni - November</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring fluktuasi kehadiran mingguan & bulanan tech team
          </p>
        </div>

        {/* Metric Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            type="button"
            onClick={() => setMetricMode('rate')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
              metricMode === 'rate'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            % Kehadiran
          </button>
          <button
            type="button"
            onClick={() => setMetricMode('count')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
              metricMode === 'count'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jumlah Hadir (Orang)
          </button>
        </div>
      </div>

      {/* KPI highlight row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-4 border-b border-slate-100">
        <div>
          <span className="text-xs text-slate-500 block">Rata-rata 6 Bulan</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {avgRate}%
            </span>
            <span className="text-xs font-medium text-emerald-600">
              +2.9% vs H1
            </span>
          </div>
        </div>

        <div>
          <span className="text-xs text-slate-500 block">Bulan Puncak Tertinggi</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {highestMonth.month} ({highestMonth.rate}%)
            </span>
            <span className="text-xs font-medium text-slate-500">
              {highestMonth.present} hadir
            </span>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <span className="text-xs text-slate-500 block">Status Performa</span>
          <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-emerald-700">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Optimal (Di atas SLA 90%)</span>
          </div>
        </div>
      </div>

      {/* Interactive Chart Area */}
      <div className="pt-4">
        <div className="w-full relative overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto max-h-64 select-none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines & Y-ticks */}
            {yTicks.map((tick) => {
              const normalizedY = (tick - minVal) / valRange;
              const y = paddingTop + innerHeight - normalizedY * innerHeight;
              return (
                <g key={tick}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 3.5}
                    textAnchor="end"
                    className="text-[11px] fill-slate-400 tabular-nums font-mono font-medium"
                  >
                    {tick}
                    {metricMode === 'rate' ? '%' : ''}
                  </text>
                </g>
              );
            })}

            {/* Gradient Area */}
            <path d={areaD} fill="url(#attendanceGradient)" />

            {/* Line Chart */}
            <path
              d={pathD}
              fill="none"
              stroke="#4f46e5"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* X-axis labels and interaction markers */}
            {points.map((pt, index) => {
              const isHovered = hoveredIndex === index;
              return (
                <g key={pt.item.month}>
                  {/* Subtle vertical indicator when active */}
                  {isHovered && (
                    <line
                      x1={pt.x}
                      y1={paddingTop}
                      x2={pt.x}
                      y2={paddingTop + innerHeight}
                      stroke="#818cf8"
                      strokeDasharray="2 2"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Target click/hover zone */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={18}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onClick={() => setHoveredIndex(index)}
                  />

                  {/* Outer circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 4}
                    fill="#ffffff"
                    stroke="#4f46e5"
                    strokeWidth={isHovered ? 3 : 2}
                    className="transition-all duration-150 pointer-events-none"
                  />

                  {/* Month Label */}
                  <text
                    x={pt.x}
                    y={height - 10}
                    textAnchor="middle"
                    className={`text-xs font-medium cursor-pointer transition-colors ${
                      isHovered ? 'fill-indigo-600 font-bold' : 'fill-slate-500'
                    }`}
                    onClick={() => setHoveredIndex(index)}
                  >
                    {pt.item.month}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Data Point Detail Card */}
        {activePoint && (
          <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">
                Detail Bulan {activePoint.item.month}:
              </span>
              <span className="text-slate-600">
                Tingkat Kehadiran{' '}
                <strong className="text-indigo-600 font-mono font-bold">
                  {activePoint.item.rate}%
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-4 text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Hadir: <strong className="text-slate-700 tabular-nums">{activePoint.item.present}</strong> staf</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Cuti: <strong className="text-slate-700 tabular-nums">{activePoint.item.onLeave}</strong> staf</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Remote: <strong className="text-slate-700 tabular-nums">{activePoint.item.remote}</strong> staf</span>
              </span>
              <span className="text-slate-400 hidden sm:inline">
                Hari Kerja: <strong className="text-slate-700 tabular-nums">{activePoint.item.totalWorkdays}</strong> hari
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
