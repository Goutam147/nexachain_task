import { FaUsers, FaChartLine, FaWallet, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-white border border-slate-200 rounded-[4px] shadow-2xs">
        <h2 className="text-xl font-bold text-slate-800">Admin Dashboard</h2>
        <p className="text-xs text-slate-500 leading-relaxed mt-1">
          Welcome back, <strong className="text-slate-700">{user?.fullName}</strong>. Manage the global NexaChain AI system properties, examine transaction logs, and review platform activities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="p-5 bg-white border border-slate-200 rounded-[4px] shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">System Users</span>
            <div className="p-2 rounded-[4px] bg-blue-50 text-blue-600">
              <FaUsers />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-800">12 User(s)</div>
          <div className="text-[10px] text-blue-600 mt-1 font-semibold">11 Active | 1 Pending</div>
        </div>

        {/* Stat 2 */}
        <div className="p-5 bg-white border border-slate-200 rounded-[4px] shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">System Volume</span>
            <div className="p-2 rounded-[4px] bg-emerald-50 text-emerald-600">
              <FaWallet />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-800">Rs. 1,45,000.00</div>
          <div className="text-[10px] text-emerald-600 mt-1 font-semibold">Platform deposits</div>
        </div>

        {/* Stat 3 */}
        <div className="p-5 bg-white border border-slate-200 rounded-[4px] shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Global ROI Rate</span>
            <div className="p-2 rounded-[4px] bg-amber-50 text-amber-600">
              <FaChartLine />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-800">1.00% Daily</div>
          <div className="text-[10px] text-slate-400 mt-1">Configured globally</div>
        </div>

        {/* Stat 4 */}
        <div className="p-5 bg-white border border-slate-200 rounded-[4px] shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">System Status</span>
            <div className="p-2 rounded-[4px] bg-indigo-50 text-indigo-600">
              <FaShieldAlt />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-800">Secured</div>
          <div className="text-[10px] text-indigo-600 mt-1 font-semibold">Firewall and SSL Active</div>
        </div>
      </div>

      {/* System Configurations card */}
      <div className="p-6 bg-white border border-slate-200 rounded-[4px] shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <span className="w-1 h-3.5 bg-blue-600"></span> NexaChain System Configuration Parameters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-[4px] space-y-1">
            <div className="font-semibold text-slate-700">Level 1 Referral Bonus</div>
            <div className="text-lg font-bold text-blue-600">5.00%</div>
            <div className="text-[10px] text-slate-400">Paid on direct referrals investments</div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-[4px] space-y-1">
            <div className="font-semibold text-slate-700">Level 2 Referral Bonus</div>
            <div className="text-lg font-bold text-blue-600">3.00%</div>
            <div className="text-[10px] text-slate-400">Paid on level 2 referrals investments</div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-[4px] space-y-1">
            <div className="font-semibold text-slate-700">Level 3 Referral Bonus</div>
            <div className="text-lg font-bold text-blue-600">2.00%</div>
            <div className="text-[10px] text-slate-400">Paid on level 3 referrals investments</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
