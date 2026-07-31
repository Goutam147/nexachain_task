import { useState } from 'react';
import { FaUser, FaEnvelope, FaPhoneAlt, FaLock } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [referral, setReferral] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    // Keep only letters and spaces
    const cleanValue = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setName(cleanValue);
  };

  const handleMobileChange = (e) => {
    // Keep only numeric characters
    const cleanValue = e.target.value.replace(/[^0-9]/g, '');
    if (cleanValue.length <= 10) {
      setMobile(cleanValue);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mobile.length !== 10) {
      setError('Mobile number must be exactly 10 digits');
      return;
    }

    setLoading(true);

    try {
      await register({
        fullName: name,
        email,
        mobileNumber: mobile,
        password,
        referralCode: referral
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 p-8 shadow-sm rounded-[4px] space-y-6">
        <div className="text-center space-y-2">
          <img 
            src="/nc_logo.png" 
            alt="NC Logo" 
            className="inline-flex w-14 h-14 rounded-full border-2 border-blue-400 p-[3px] bg-white shadow-sm object-cover" 
          />
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Create an Account</h2>
          <p className="text-sm text-slate-500">Join NC Investment and start earning daily ROI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-xs text-red-600 rounded-[4px] font-semibold text-center">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 block">Full Name <span className="text-red-500 font-bold">*</span></label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <FaUser className="text-sm" />
              </span>
              <input 
                type="text" 
                required
                disabled={loading}
                value={name}
                onChange={handleNameChange}
                placeholder="John Doe"
                pattern="[a-zA-Z\s]+"
                title="Full name must contain only letters and spaces"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-[4px] text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 block">Email Address <span className="text-red-500 font-bold">*</span></label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <FaEnvelope className="text-sm" />
              </span>
              <input 
                type="email" 
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-[4px] text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 block">Mobile Number <span className="text-red-500 font-bold">*</span></label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <FaPhoneAlt className="text-xs" />
              </span>
              <input 
                type="tel" 
                required
                disabled={loading}
                value={mobile}
                onChange={handleMobileChange}
                placeholder="9876543210"
                pattern="[0-9]{10}"
                title="Mobile number must be exactly 10 digits"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-[4px] text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 block">Password <span className="text-red-500 font-bold">*</span></label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <FaLock className="text-sm" />
              </span>
              <input 
                type="password" 
                required
                minLength={6}
                maxLength={254}
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-[4px] text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 block">Referral Code (Optional)</label>
            <input 
              type="text" 
              disabled={loading}
              value={referral}
              onChange={(e) => setReferral(e.target.value)}
              placeholder="e.g. NEXA1234"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-[4px] text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link 
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
