import { useState } from 'react';
import { 
  FaWallet, 
  FaChartLine, 
  FaUsers, 
  FaCoins, 
  FaNodeJs, 
  FaReact, 
  FaDatabase, 
  FaServer, 
  FaPlay, 
  FaPlusCircle,
  FaSignOutAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

function Dashboard() {
  // Dashboard Data State
  const [walletBalance, setWalletBalance] = useState(35.00);
  const [totalInvestments, setTotalInvestments] = useState(1000.00);
  const [roiEarned, setRoiEarned] = useState(10.00);
  const [levelIncome, setLevelIncome] = useState(25.00);
  const navigate = useNavigate();

  // Mock list of transactions
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'ROI Payout', amount: 10.00, date: '2026-07-30 12:00 AM', status: 'Completed' },
    { id: 2, type: 'Referral (Bob)', amount: 25.00, date: '2026-07-30 09:15 AM', status: 'Completed' }
  ]);

  // Mock list of referrals
  const [referrals, setReferrals] = useState([
    { name: 'Bob Smith', email: 'bob@example.com', investment: '$500.00', level: 1 }
  ]);

  const handleSimulateCron = () => {
    const newRoi = 10.00;
    setWalletBalance(prev => prev + newRoi);
    setRoiEarned(prev => prev + newRoi);
    setTransactions(prev => [
      { 
        id: prev.length + 1, 
        type: 'ROI (Simulated)', 
        amount: newRoi, 
        date: new Date().toLocaleTimeString(), 
        status: 'Completed' 
      },
      ...prev
    ]);
  };

  const handleSimulateReferral = () => {
    const newReferralBonus = 12.50;
    setWalletBalance(prev => prev + newReferralBonus);
    setLevelIncome(prev => prev + newReferralBonus);
    setReferrals(prev => [
      ...prev,
      { name: `Charlie User ${prev.length + 1}`, email: `charlie${prev.length + 1}@example.com`, investment: '$250.00', level: 1 }
    ]);
    setTransactions(prev => [
      { 
        id: prev.length + 1, 
        type: `Referral (Charlie ${prev.length})`, 
        amount: newReferralBonus, 
        date: new Date().toLocaleTimeString(), 
        status: 'Completed' 
      },
      ...prev
    ]);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[4px] bg-blue-600 flex items-center justify-center shadow-xs">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 m-0 leading-none">NexaChain AI</h1>
            <span className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider">Investment Ecosystem</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-[4px] text-blue-700 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Server Live
          </div>
          <Button 
            onClick={handleLogout}
            variant="danger"
          >
            <FaSignOutAlt className="mr-1.5" /> Sign Out
          </Button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 border-r border-slate-200 bg-white p-6 flex flex-col gap-6">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Options</div>
          
          <nav className="flex flex-col gap-1">
            <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 text-blue-700 border-l-2 border-blue-600 text-xs font-bold rounded-[4px]">
              <FaChartLine /> Main Dashboard
            </div>
            <div className="flex items-center gap-3 px-4 py-2.5 text-slate-500 text-xs font-semibold">
              <FaUsers /> Referral Network (Lvl 1)
            </div>
          </nav>

          <div className="border-t border-slate-200 pt-6 mt-auto">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3">System Backend</div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
              <div className="flex items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-[4px]">
                <FaDatabase className="text-emerald-600" /> Mongo
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-[4px]">
                <FaServer className="text-blue-600" /> Express
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-[4px]">
                <FaReact className="text-cyan-500" /> React
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-[4px]">
                <FaNodeJs className="text-green-600" /> Node
              </div>
            </div>
          </div>
        </aside>

        {/* Dashboard Area */}
        <main className="flex-1 p-6 md:p-8 bg-slate-50">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Top Info Banner */}
            <div className="p-6 bg-white border border-slate-200 rounded-[4px] shadow-2xs space-y-4">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-800">Welcome back, Alice!</h2>
                <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                  This mock dashboard features dynamic triggers below. You can simulate backend cron jobs and referral registrations to test standard transactions, wallet balance adjustments, and referral code tracking.
                </p>
              </div>

              {/* Action Buttons with 3-4px radius */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                <Button 
                  onClick={handleSimulateCron}
                  variant="simPrimary"
                >
                  <FaPlay className="text-[9px] mr-1.5" /> Simulate Midnight Cron (+$10 ROI)
                </Button>
                <Button 
                  onClick={handleSimulateReferral}
                  variant="simSecondary"
                >
                  <FaPlusCircle className="text-[10px] mr-1.5" /> Simulate Bob Referral (+$12.5)
                </Button>
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
                <div className="text-xl font-bold text-slate-800">${totalInvestments.toFixed(2)}</div>
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
                <div className="text-xl font-bold text-slate-800">${walletBalance.toFixed(2)}</div>
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
                <div className="text-xl font-bold text-slate-800">${roiEarned.toFixed(2)}</div>
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
                <div className="text-xl font-bold text-slate-800">${levelIncome.toFixed(2)}</div>
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
                          <td className="py-3 px-3 font-bold text-blue-600">+${tx.amount.toFixed(2)}</td>
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
                        AL
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-700">Alice (You)</div>
                        <div className="text-[9px] text-slate-500">Code: REF-ALICE77</div>
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
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-[10px] text-slate-400">
        NexaChain AI System &copy; 2026. Made with Roboto + Tailwind CSS v4 + React Icons.
      </footer>
    </div>
  );
}

export default Dashboard;
