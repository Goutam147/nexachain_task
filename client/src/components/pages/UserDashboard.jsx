import { useState, useEffect } from 'react';
import { 
  FaWallet, 
  FaChartLine, 
  FaUsers, 
  FaCoins
} from 'react-icons/fa';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

// Custom Responsive SVG Line Chart Component
function PerformanceChart({ data }) {
  const width = 800;
  const height = 240; // Reduced height to fit perfectly side-by-side
  const paddingLeft = 55;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Find max value in data to scale Y-axis
  const maxVal = Math.max(
    ...data.map(d => Math.max(d.credit, d.debit)),
    100 // Default minimum ceiling to look clean
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
  const pointsCredit = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.credit / maxVal) * chartHeight;
    return { x, y, val: d.credit, date: d.date };
  });

  const pointsDebit = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.debit / maxVal) * chartHeight;
    return { x, y, val: d.debit, date: d.date };
  });

  // SVG path command strings
  const pathCredit = pointsCredit.length > 0 
    ? `M ${pointsCredit[0].x} ${pointsCredit[0].y} ` + pointsCredit.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const pathDebit = pointsDebit.length > 0 
    ? `M ${pointsDebit[0].x} ${pointsDebit[0].y} ` + pointsDebit.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  return (
    <div className="space-y-3">
      {/* Chart Legend */}
      <div className="flex items-center justify-center gap-6 text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-2 bg-slate-800 rounded-xs"></span>
          <span className="font-extrabold text-slate-700">Credit</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-2 bg-emerald-500 rounded-xs"></span>
          <span className="font-extrabold text-slate-700">Debit</span>
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

          {/* Lines */}
          <path 
            d={pathCredit} 
            fill="none" 
            stroke="#1e293b" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d={pathDebit} 
            fill="none" 
            stroke="#10b981" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Credit White Nodes */}
          {pointsCredit.map((p, i) => (
            <circle 
              key={i} 
              cx={p.x} 
              cy={p.y} 
              r="4" 
              fill="white" 
              stroke="#1e293b" 
              strokeWidth="2"
              className="cursor-pointer"
            >
              <title>{`${p.date}\nCredit: ₹${p.val.toFixed(2)}`}</title>
            </circle>
          ))}

          {/* Debit White Nodes */}
          {pointsDebit.map((p, i) => (
            <circle 
              key={i} 
              cx={p.x} 
              cy={p.y} 
              r="4" 
              fill="white" 
              stroke="#10b981" 
              strokeWidth="2"
              className="cursor-pointer"
            >
              <title>{`${p.date}\nDebit: ₹${p.val.toFixed(2)}`}</title>
            </circle>
          ))}
        </svg>
      </div>
    </div>
  );
}

function UserDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/dashboard');
        if (data.status === 'success') {
          setDashboardData(data.data);
        } else {
          setError(data.message || 'Failed to retrieve dashboard telemetry');
        }
      } catch (err) {
        console.error(err);
        setError('Network error: Make sure the server is online');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
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

  const { stats, chartData } = dashboardData;

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Top Header Card */}
      <div className="p-4 bg-white border border-slate-200 rounded-[4px] shadow-2xs">
        <h2 className="text-lg font-black text-slate-800 tracking-tight leading-none">Dashboard</h2>
        <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-wider block mt-1">
          Welcome back, {user?.fullName || 'User'}!
        </span>
      </div>

      {/* Side-by-Side Viewport Layout (No Vertical Scroll needed) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column: Stack of 4 Compact Stats Cards */}
        <div className="md:col-span-1 flex flex-col gap-3">
          {/* Stat 1 */}
          <div className="p-3.5 bg-white border border-slate-200 border-l-4 border-l-blue-600 rounded-[4px] shadow-2xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total Investment</span>
              <strong className="text-base font-black text-slate-800 block">₹{stats.totalInvestments.toFixed(2)}</strong>
            </div>
            <div className="p-2.5 rounded-[4px] bg-blue-50 text-blue-600 text-sm">
              <FaCoins />
            </div>
          </div>

          {/* Stat 2 */}
          <div className="p-3.5 bg-white border border-slate-200 border-l-4 border-l-emerald-650 rounded-[4px] shadow-2xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Wallet Balance</span>
              <strong className="text-base font-black text-slate-800 block">₹{stats.walletBalance.toFixed(2)}</strong>
            </div>
            <div className="p-2.5 rounded-[4px] bg-emerald-50 text-emerald-600 text-sm">
              <FaWallet />
            </div>
          </div>

          {/* Stat 3 */}
          <div className="p-3.5 bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-[4px] shadow-2xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Daily ROI Earned</span>
              <strong className="text-base font-black text-slate-800 block">₹{stats.roiEarned.toFixed(2)}</strong>
            </div>
            <div className="p-2.5 rounded-[4px] bg-amber-50 text-amber-600 text-sm">
              <FaChartLine />
            </div>
          </div>

          {/* Stat 4 */}
          <div className="p-3.5 bg-white border border-slate-200 border-l-4 border-l-indigo-600 rounded-[4px] shadow-2xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Level Income</span>
              <strong className="text-base font-black text-slate-800 block">₹{stats.levelIncome.toFixed(2)}</strong>
            </div>
            <div className="p-2.5 rounded-[4px] bg-indigo-50 text-indigo-600 text-sm">
              <FaUsers />
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Timeline Analytics Line Chart */}
        <div className="md:col-span-2 p-4 bg-white border border-slate-200 rounded-[4px] shadow-2xs flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <span className="w-1.5 h-3.5 bg-blue-600 rounded-full"></span> 
            Credit & Debit Performance
          </h3>
          <div className="flex-1 flex items-center">
            <div className="w-full">
              <PerformanceChart data={chartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
