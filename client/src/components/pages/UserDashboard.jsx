import { useState } from 'react';
import { 
  FaWallet, 
  FaChartLine, 
  FaUsers, 
  FaCoins
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

function UserDashboard() {
  const { user } = useAuth();
  
  // Dashboard Data State (fallbacks to mocks if not loaded or 0)
  const walletBalance = user?.walletBalance ?? 35.00;
  const totalInvestments = 1000.00; // Mock standard starting active contract
  const roiEarned = user?.totalRoiEarned ?? 10.00;
  const levelIncome = user?.totalLevelIncomeEarned ?? 25.00;

  // Mock list of transactions
  const [transactions] = useState([
    { id: 1, type: 'ROI Payout', amount: 10.00, date: '2026-07-30 12:00 AM', status: 'Completed' },
    { id: 2, type: 'Referral (Bob)', amount: 25.00, date: '2026-07-30 09:15 AM', status: 'Completed' }
  ]);

  // Mock list of referrals
  const [referrals] = useState([
    { name: 'Bob Smith', email: 'bob@example.com', investment: '₹500.00', level: 1 }
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Info Banner */}
      <div className="p-6 bg-white border border-slate-200 rounded-[4px] shadow-2xs">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800">Welcome back, {user?.fullName}!</h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
            View your NexaChain AI investment growth, wallet statistics, transaction history, and direct referral tree hierarchy in real-time.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="p-5 bg-white border border-slate-200 rounded-[4px] shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Investment</span>
            <div className="p-2 rounded-[4px] bg-blue-50 text-blue-600">
              <FaCoins />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-800">₹{totalInvestments.toFixed(2)}</div>
          <div className="text-[10px] text-blue-600 mt-1 font-semibold">1 Active Contract</div>
        </div>

        {/* Stat 2 */}
        <div className="p-5 bg-white border border-slate-200 rounded-[4px] shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Wallet Balance</span>
            <div className="p-2 rounded-[4px] bg-emerald-50 text-emerald-600">
              <FaWallet />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-800">₹{walletBalance.toFixed(2)}</div>
          <div className="text-[10px] text-emerald-600 mt-1 font-semibold">Available for withdrawal</div>
        </div>

        {/* Stat 3 */}
        <div className="p-5 bg-white border border-slate-200 rounded-[4px] shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Daily ROI Earned</span>
            <div className="p-2 rounded-[4px] bg-amber-50 text-amber-600">
              <FaChartLine />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-800">₹{roiEarned.toFixed(2)}</div>
          <div className="text-[10px] text-slate-400 mt-1">1.00% daily payout</div>
        </div>

        {/* Stat 4 */}
        <div className="p-5 bg-white border border-slate-200 rounded-[4px] shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Level Income</span>
            <div className="p-2 rounded-[4px] bg-indigo-50 text-indigo-600">
              <FaUsers />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-800">₹{levelIncome.toFixed(2)}</div>
          <div className="text-[10px] text-slate-400 mt-1">Active referrals network</div>
        </div>
      </div>

      {/* Grid of Network and History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions Table */}
        <div className="lg:col-span-2 p-5 bg-white border border-slate-200 rounded-[4px] shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <span className="w-1 h-3.5 bg-blue-600"></span> Recent Earnings Log
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">TxID</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-500">TX-00{tx.id}</td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{tx.type}</td>
                    <td className="py-3 px-3 font-bold text-blue-600">+₹{tx.amount.toFixed(2)}</td>
                    <td className="py-3 px-3 text-slate-500">{tx.date}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Referral Tree Structure */}
        <div className="p-5 bg-white border border-slate-200 rounded-[4px] shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <span className="w-1 h-3.5 bg-blue-600"></span> Direct Referrals Tree
          </h3>
          
          <div className="space-y-4 pt-2">
            {/* Root User */}
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-[4px] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-[4px] bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {user?.fullName?.substring(0, 2).toUpperCase() || 'ME'}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-700">{user?.fullName} (You)</div>
                  <div className="text-[9px] text-slate-500">Code: {user?.referralCode}</div>
                </div>
              </div>
              <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-[4px]">Root</span>
            </div>

            {/* Node Connectors */}
            <div className="pl-4 border-l border-slate-200 ml-3 space-y-3">
              {referrals.map((ref, idx) => (
                <div key={idx} className="relative flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-[4px] before:content-[''] before:absolute before:right-full before:w-4 before:h-[1px] before:bg-slate-200">
                  <div className="w-6 h-6 rounded-[4px] bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-500">
                    {ref.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-700">{ref.name}</div>
                    <div className="text-[9px] text-slate-500">Investment: {ref.investment}</div>
                  </div>
                  <span className="ml-auto text-[9px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-[4px]">
                    Lvl {ref.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
