import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import GuestLayout from './components/layouts/GuestLayout';
import UserLayout from './components/layouts/UserLayout';
import AdminLayout from './components/layouts/AdminLayout';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import UserDashboard from './components/pages/UserDashboard';
import AdminDashboard from './components/pages/AdminDashboard';
import UserList from './components/pages/UserList';
import PlanList from './components/pages/PlanList';
import InvestmentList from './components/pages/InvestmentList';
import ReferralHistory from './components/pages/referral/ReferralHistory';
import ReferralTree from './components/pages/referral/ReferralTree';

function HomeRedirect() {
  const { user, loading } = useAuth();
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
  return <Navigate to="/dashboard" replace />;
}

const router = createBrowserRouter([
  // Home Route
  {
    path: '/',
    element: <HomeRedirect />
  },
  // Guest Routes
  {
    element: <GuestLayout />,
    children: [
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      }
    ]
  },
  // User Authorized Routes
  {
    element: <UserLayout />,
    children: [
      {
        path: '/dashboard',
        element: <UserDashboard />
      },
      {
        path: '/investments',
        element: <InvestmentList />
      },
      {
        path: '/referrals/history',
        element: <ReferralHistory />
      },
      {
        path: '/referrals/tree',
        element: <ReferralTree />
      }
    ]
  },
  // Admin Authorized Routes
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'dashboard',
        element: <AdminDashboard />
      },
      {
        path: 'users',
        element: <UserList />
      },
      {
        path: 'plans',
        element: <PlanList />
      }
    ]
  },
  // Fallback Route
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  );
}

export default App;
