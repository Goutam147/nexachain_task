import { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaChartLine, FaSignOutAlt, FaCoins, FaUsers, FaChevronDown, FaHistory, FaSitemap } from 'react-icons/fa';
import Button from '../ui/Button';

function UserLayout() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const [referralOpen, setReferralOpen] = useState(
    location.pathname.startsWith('/referrals')
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const isReferralActive = location.pathname.startsWith('/referrals');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <img 
            src="/nc_logo.png" 
            alt="NC Logo" 
            className="w-10 h-10 rounded-full border-2 border-blue-400 p-[3px] bg-white shadow-xs object-cover" 
          />
          <div>
            <h1 className="text-lg font-bold text-slate-800 m-0 leading-none">NC Investment</h1>
            <span className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider">User Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Logged in as: <strong className="text-slate-700">{user.fullName}</strong>
          </span>
          <Button 
            onClick={logout}
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
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Menu</div>
          
          <nav className="flex flex-col gap-1">
            <Link 
              to="/dashboard"
              className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-[4px] transition-colors ${
                location.pathname === '/dashboard' 
                  ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FaChartLine /> Main Dashboard
            </Link>
            
            <Link 
              to="/investments"
              className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-[4px] transition-colors ${
                location.pathname === '/investments' 
                  ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FaCoins /> Investment
            </Link>

            <Link 
              to="/roi-history"
              className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-[4px] transition-colors ${
                location.pathname === '/roi-history' 
                  ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FaHistory /> ROI History
            </Link>

            {/* Referral Dropdown */}
            <div>
              <button
                onClick={() => setReferralOpen(!referralOpen)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold rounded-[4px] transition-colors cursor-pointer ${
                  isReferralActive
                    ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <FaUsers /> Referral
                </span>
                <FaChevronDown className={`text-[8px] transition-transform duration-200 ${referralOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Submenu */}
              <div className={`overflow-hidden transition-all duration-200 ${referralOpen ? 'max-h-40 mt-1' : 'max-h-0'}`}>
                <Link
                  to="/referrals/history"
                  className={`flex items-center gap-3 pl-11 pr-4 py-2 text-xs font-bold rounded-[4px] transition-colors ${
                    location.pathname === '/referrals/history'
                      ? 'text-blue-700 bg-blue-50/60'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  <FaHistory className="text-[10px]" /> History
                </Link>
                <Link
                  to="/referrals/tree"
                  className={`flex items-center gap-3 pl-11 pr-4 py-2 text-xs font-bold rounded-[4px] transition-colors ${
                    location.pathname === '/referrals/tree'
                      ? 'text-blue-700 bg-blue-50/60'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  <FaSitemap className="text-[10px]" /> Referral Tree
                </Link>
              </div>
            </div>
          </nav>
        </aside>

        {/* Dashboard Area */}
        <main className="flex-1 p-2 sm:p-3 bg-slate-50">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-[10px] text-slate-400">
        NC Investment System &copy; 2026. Made with Roboto + Tailwind CSS v4 + React Icons.
      </footer>
    </div>
  );
}

export default UserLayout;
