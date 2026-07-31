import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaChartLine, FaUsers, FaCoins, FaSignOutAlt } from 'react-icons/fa';
import Button from '../ui/Button';

function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

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

  if (user.role !== 'admin') {
    // If not admin, they are unauthorized. We redirect them back to their standard user dashboard.
    return <Navigate to="/dashboard" replace />;
  }

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
            <span className="text-[10px] text-red-600 font-semibold uppercase tracking-wider">Admin Control Panel</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Logged in as: <strong className="text-slate-700">{user.fullName} (Admin)</strong>
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
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Admin Menu</div>
          
          <nav className="flex flex-col gap-1">
            <Link 
              to="/admin/dashboard"
              className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-[4px] transition-colors ${
                location.pathname === '/admin/dashboard' 
                  ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FaChartLine /> Admin Dashboard
            </Link>

            <Link 
              to="/admin/users"
              className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-[4px] transition-colors ${
                location.pathname === '/admin/users' 
                  ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FaUsers /> User Directory
            </Link>

            <Link 
              to="/admin/plans"
              className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-[4px] transition-colors ${
                location.pathname === '/admin/plans' 
                  ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FaCoins /> Investment Plans
            </Link>
          </nav>
        </aside>

        {/* Dashboard Area */}
        <main className="flex-1 p-2 sm:p-3 bg-slate-50">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-[10px] text-slate-400">
        NC Investment System &copy; 2026. Admin Panel.
      </footer>
    </div>
  );
}

export default AdminLayout;
