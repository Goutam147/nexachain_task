import { useState, useEffect } from 'react';
import { FaUsers, FaChartLine, FaWallet, FaShieldAlt } from 'react-icons/fa';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

// Custom Responsive SVG Line Chart Component for Admin Dashboard
function AdminPerformanceChart({ data }) {
  const width = 800;
  const height = 240;
  const paddingLeft = 60;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Find max value in data to scale Y-axis
  const maxVal = Math.max(
    ...data.map(d => d.amount),
    1000 // Default minimum ceiling to look clean
  );

  // Y-axis tick values (5 divisions)
  const yTicks = [
    maxVal,
    maxVal * 0.75,
    maxVal * 0.5,
    maxVal * 0.25,
    0
  ];

  // Helper to format currency values cleanly
  const formatCurrency = (val) => {
    if (val >= 1000) {
      return `₹${(val / 1000).toFixed(0)}k`;
    }
    return `₹${val}`;
  };

  // Compute point coordinates
  const points = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.amount / maxVal) * chartHeight;
    return { x, y, val: d.amount, date: d.date };
  });

  // SVG path command string
  const pathData = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  return (
    <div className="space-y-4">
      {/* Chart Legend */}
      <div className="flex items-center justify-center gap-6 text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-2 bg-blue-600 rounded-xs"></span>
          <span className="font-extrabold text-slate-700">Total Investment Amount (₹)</span>
        </div>
      </div>

      {/* SVG Chart Viewport */}
      <div className="w-full overflow-x-auto select-none">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full min-w-[500px] h-[200px] font-sans"
        >
          {/* Horizontal Gridlines & Y-axis Labels */}
          {yTicks.map((tick, i) => {
            const y = paddingTop + (i / 4) * chartHeight;
            return (
              <g key={i} className="text-[9px] text-slate-400 font-extrabold">
                <text 
                  x={paddingLeft - 8} 
                  y={y + 3} 
                  textAnchor="end"
                  fill="currentColor"
                >
                  {formatCurrency(tick)}
                </text>
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={width - paddingRight} 
                  y2={y} 
                  stroke="#f1f5f9" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4"
                />
              </g>
            );
          })}

          {/* X-axis Labels */}
          {data.map((d, i) => {
            const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
            return (
              <text 
                key={i} 
                x={x} 
                y={height - 5} 
                textAnchor="middle" 
                fill="#94a3b8" 
                className="text-[9px] font-extrabold"
              >
                {d.date}
              </text>
            );
          })}

          {/* Line */}
          <path 
            d={pathData} 
            fill="none" 
            stroke="#2563eb" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="transition-all duration-500"
          />

          {/* Interactive White Nodes */}
          {points.map((p, i) => (
            <circle 
              key={i} 
              cx={p.x} 
              cy={p.y} 
              r="4.5" 
              fill="white" 
              stroke="#2563eb" 
              strokeWidth="2.5"
              className="cursor-pointer hover:r-[6px] transition-all"
            >
              <title>{`${p.date}\nInvestment: ₹${p.val.toFixed(2)}`}</title>
            </circle>
          ))}
        </svg>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { user } = useAuth();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        const { data } = await api.get('/dashboard/admin');
        if (data.status === 'success') {
          setAdminData(data.data);
        } else {
          setError(data.message || 'Failed to retrieve admin telemetry');
        }
      } catch (err) {
        console.error(err);
        setError('Network error: Make sure the server is online');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4 bg-red-50 border border-red-200 rounded-[4px] text-xs text-red-700 font-extrabold">
        Error: {error}
      </div>
    );
  }

  const { stats, chartData } = adminData;

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Top Header Card */}
      <div className="p-4 bg-white border border-slate-200 rounded-[4px] shadow-2xs">
        <h2 className="text-lg font-black text-slate-800 tracking-tight leading-none">Admin Dashboard</h2>
        <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-wider block mt-1">
          Welcome back, {user?.fullName || 'Admin'}!
        </span>
      </div>

      {/* Side-by-Side Viewport Layout (No Vertical Scroll needed) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column: Stack of 4 Compact Stats Cards */}
        <div className="md:col-span-1 flex flex-col gap-3">
          {/* Stat 1 */}
          <div className="p-3.5 bg-white border border-slate-200 border-l-4 border-l-blue-600 rounded-[4px] shadow-2xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">System Users</span>
              <strong className="text-base font-black text-slate-800 block">{stats.totalUsers} User(s)</strong>
            </div>
            <div className="p-2.5 rounded-[4px] bg-blue-50 text-blue-600 text-sm">
              <FaUsers />
            </div>
          </div>

          {/* Stat 2 */}
          <div className="p-3.5 bg-white border border-slate-200 border-l-4 border-l-emerald-650 rounded-[4px] shadow-2xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">System Volume</span>
              <strong className="text-base font-black text-slate-800 block">₹{stats.totalVolume.toFixed(2)}</strong>
            </div>
            <div className="p-2.5 rounded-[4px] bg-emerald-50 text-emerald-600 text-sm">
              <FaWallet />
            </div>
          </div>

          {/* Stat 3 */}
          <div className="p-3.5 bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-[4px] shadow-2xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Active Plans</span>
              <strong className="text-base font-black text-slate-800 block">{stats.activePlansCount} Programs</strong>
            </div>
            <div className="p-2.5 rounded-[4px] bg-amber-50 text-amber-600 text-sm">
              <FaChartLine />
            </div>
          </div>

          {/* Stat 4 */}
          <div className="p-3.5 bg-white border border-slate-200 border-l-4 border-l-indigo-600 rounded-[4px] shadow-2xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">System Status</span>
              <strong className="text-base font-black text-slate-800 block">Secured</strong>
            </div>
            <div className="p-2.5 rounded-[4px] bg-indigo-50 text-indigo-600 text-sm">
              <FaShieldAlt />
            </div>
          </div>
        </div>

        {/* Right Column: Global Dynamic Investment Line Chart */}
        <div className="md:col-span-2 p-4 bg-white border border-slate-200 rounded-[4px] shadow-2xs flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-full"></span> 
            Global Daily Investment Volume Timeline
          </h3>
          <div className="flex-1 flex items-center">
            <div className="w-full">
              <AdminPerformanceChart data={chartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
