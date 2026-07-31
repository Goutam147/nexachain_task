import { useState, useEffect } from 'react';
import { FaTimes, FaCopy, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';

function ReferralHistory() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch referral income history
  const fetchReferrals = async () => {
    try {
      const { data } = await api.get('/referrals');
      if (data.status === 'success') {
        setReferrals(data.referrals);
      } else {
        setError(data.message || 'Failed to fetch referral history');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed. Make sure the server is online.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  // Copy referral code to clipboard
  const handleCopyCode = async () => {
    if (!user?.referralCode) return;
    try {
      await navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      toast.success('Referral code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy referral code');
    }
  };

  // Filter by generator name or email
  const filteredReferrals = referrals.filter((ref) => {
    const term = searchTerm.toLowerCase();
    const name = ref.generator?.fullName || '';
    const email = ref.generator?.email || '';
    return (
      name.toLowerCase().includes(term) ||
      email.toLowerCase().includes(term)
    );
  });

  // Pagination calculations
  const totalItems = filteredReferrals.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReferrals.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Single Card */}
      <div className="p-5 bg-white border border-slate-200 rounded-[4px] shadow-xs space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-4.5 bg-blue-600 rounded-full"></span>
            Referral Income History
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Your Referral Code :</span>
            <span className="text-sm font-extrabold text-blue-700 tracking-wider">
              {user?.referralCode || '—'}
            </span>
            <button
              onClick={handleCopyCode}
              className="ml-1 p-1.5 bg-slate-50 border border-slate-300 rounded-[4px] hover:bg-slate-100 transition-colors cursor-pointer"
              title="Copy referral code"
            >
              {copied ? (
                <FaCheck className="text-emerald-600 text-xs" />
              ) : (
                <FaCopy className="text-slate-400 hover:text-blue-600 text-xs transition-colors" />
              )}
            </button>
          </div>
        </div>

        {/* Datatable Controls */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 bg-white border border-slate-400 rounded-[4px] font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-[4px] text-xs text-red-700 font-extrabold">
            Error: {error}
          </div>
        )}

        {/* Referral History Table */}
        {!loading && !error && (
          <>
            <div className="overflow-x-auto border border-slate-200 rounded-[4px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-800 font-extrabold bg-slate-100">
                    <th className="py-3 px-3 w-16">Sl. No.</th>
                    <th className="py-3 px-3">From (Name)</th>
                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3">Level</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentItems.map((ref, idx) => (
                    <tr key={ref._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 text-slate-700 font-bold">
                        {indexOfFirstItem + idx + 1}
                      </td>
                      <td className="py-3 px-3 font-extrabold text-slate-900">
                        {ref.generator?.fullName || '—'}
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium">
                        {ref.generator?.email || '—'}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-extrabold border bg-blue-50 text-blue-700 border-blue-300">
                          Level {ref.level}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-extrabold text-emerald-700">
                        +₹{ref.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium text-right">
                        {new Date(ref.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                  {currentItems.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-slate-500 font-extrabold bg-slate-50">
                        No referral income recorded yet. Share your referral code to start earning!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredReferrals.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                  <span>Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(parseInt(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 bg-white border border-slate-350 rounded-[4px] focus:outline-none focus:border-blue-600 font-semibold"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span>entries</span>
                  <span className="ml-2 text-slate-500 font-medium">
                    (Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} total)
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => paginate(currentPage - 1)}
                    className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-55 rounded-[4px] text-xs font-bold text-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => paginate(idx + 1)}
                      className={`px-3 py-1 rounded-[4px] text-xs font-bold transition-colors cursor-pointer ${
                        currentPage === idx + 1
                          ? 'bg-blue-600 border border-blue-600 text-white'
                          : 'bg-white border border-slate-300 hover:bg-slate-55 text-slate-750'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => paginate(currentPage + 1)}
                    className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-55 rounded-[4px] text-xs font-bold text-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ReferralHistory;
