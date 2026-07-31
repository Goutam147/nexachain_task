import { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaCoins, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import Button from '../ui/Button';

function InvestmentList() {
  const [investments, setInvestments] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [amount, setAmount] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Key filters to prevent entering e, E, -, + or dot inside numeric fields
  const handleDecimalKeyDown = (e) => {
    if (['e', 'E', '-', '+'].includes(e.key)) {
      e.preventDefault();
    }
  };

  // Fetch investments history
  const fetchInvestments = async () => {
    try {
      const { data } = await api.get('/investments');
      if (data.status === 'success') {
        setInvestments(data.investments);
      } else {
        setError(data.message || 'Failed to fetch investment history');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed. Make sure the server is online.');
    }
  };

  // Fetch plans to populate selector dropdown
  const fetchPlans = async () => {
    try {
      const { data } = await api.get('/plans');
      if (data.status === 'success') {
        setPlans(data.plans);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchInvestments(), fetchPlans()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter active plans for the dropdown selection
  const activePlans = plans.filter(p => p.status === 'Active');

  // Currently selected plan details
  const selectedPlan = plans.find(p => p._id === selectedPlanId);

  // Handler for investment amount input change
  const handleAmountChange = (e) => {
    let val = e.target.value;
    
    // Remove leading zeros
    val = val.replace(/^0+(?=\d)/, '');
    
    // Limit to max 3 decimal places
    const parts = val.split('.');
    if (parts[1] && parts[1].length > 3) {
      val = parts[0] + '.' + parts[1].substring(0, 3);
    }
    
    setAmount(val);
  };

  // Handle Make Investment Form Submission
  const handleMakeInvestmentSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!selectedPlanId) {
      setModalError('Please select an investment plan');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setModalError('Please enter a valid investment amount');
      return;
    }

    if (parsedAmount < selectedPlan.minInvestAmount) {
      setModalError(`Minimum investment amount for this plan is ₹${selectedPlan.minInvestAmount.toFixed(2)}`);
      return;
    }

    setModalLoading(true);

    try {
      const { data } = await api.post('/investments', {
        investmentAmount: parsedAmount,
        planDetails: selectedPlanId
      });

      if (data.status === 'success') {
        toast.success(data.message || 'Investment created successfully!');
        setAmount('');
        setSelectedPlanId('');
        setIsModalOpen(false);
        fetchInvestments(); // Refresh local list
      } else {
        setModalError(data.message || 'Failed to create investment');
      }
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || 'Network error, please try again';
      setModalError(message);
    } finally {
      setModalLoading(false);
    }
  };

  // Filter history entries by plan name
  const filteredInvestments = investments.filter((inv) => {
    const name = inv.planDetails?.planName || 'Plan Details';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination calculations
  const totalItems = filteredInvestments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInvestments.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Dashboard Table Card */}
      <div className="p-5 bg-white border border-slate-200 rounded-[4px] shadow-xs space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-4.5 bg-blue-600 rounded-full"></span>
            Investment History
          </h2>
          <Button
            onClick={() => {
              setModalError('');
              setAmount('');
              setSelectedPlanId('');
              setIsModalOpen(true);
            }}
            variant="primary"
          >
            <FaPlus className="text-[10px] mr-1.5" /> Make Investment
          </Button>
        </div>

        {/* Datatable Controls */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search by plan name..."
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

        {/* Investments Table */}
        {!loading && !error && (
          <>
            <div className="overflow-x-auto border border-slate-200 rounded-[4px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-800 font-extrabold bg-slate-100">
                    <th className="py-3 px-3 w-16">Sl. No.</th>
                    <th className="py-3 px-3">Plan Name</th>
                    <th className="py-3 px-3">Investment Amount</th>
                    <th className="py-3 px-3">Daily ROI</th>
                    <th className="py-3 px-3">Period</th>
                    <th className="py-3 px-3">Start Date</th>
                    <th className="py-3 px-3">End Date</th>
                    <th className="py-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentItems.map((inv, idx) => (
                    <tr key={inv._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 text-slate-700 font-bold">
                        {indexOfFirstItem + idx + 1}
                      </td>
                      <td className="py-3 px-3 font-extrabold text-slate-900">
                        {inv.planDetails?.planName || 'Custom Plan'}
                      </td>
                      <td className="py-3 px-3 font-extrabold text-slate-950">
                        ₹{inv.investmentAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-emerald-700 font-bold">
                        {inv.dailyRoiPercentage.toFixed(2)}% Daily
                      </td>
                      <td className="py-3 px-3 text-slate-800 font-bold">
                        {Math.round((new Date(inv.endDate) - new Date(inv.startDate)) / (24 * 60 * 60 * 1000))} Days
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium">
                        {new Date(inv.startDate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium">
                        {new Date(inv.endDate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-extrabold border ${
                          inv.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : inv.status === 'Completed'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : 'bg-amber-50 text-amber-700 border-amber-300'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {currentItems.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-slate-500 font-extrabold bg-slate-50">
                        No investment contracts recorded. Click Make Investment to start.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredInvestments.length > 0 && (
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

      {/* Creation Modal Popup Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50 animate-overlay-in">
          <div className="bg-white border border-slate-300 w-full max-w-md rounded-[4px] p-6 shadow-xl space-y-5 relative animate-modal-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <FaCoins className="text-blue-600 text-xs" /> Purchase Investment Contract
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-750 cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleMakeInvestmentSubmit} className="space-y-4">
              {modalError && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-[4px] font-extrabold text-center animate-shake">
                  {modalError}
                </div>
              )}

              {/* Selector Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Select Investment Plan <span className="text-red-500">*</span>
                </label>
                <select
                  disabled={modalLoading}
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-400 rounded-[4px] text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-slate-50"
                >
                  <option value="">-- Choose Plan --</option>
                  {activePlans.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.planName} (Min: ₹{p.minInvestAmount.toFixed(0)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Plan Info Card */}
              {selectedPlan && (
                <div className="p-3 bg-slate-50 border border-slate-200 text-xs rounded-[4px] space-y-2">
                  <h4 className="font-extrabold text-slate-900 flex items-center gap-1">
                    <FaInfoCircle className="text-blue-500" /> Plan parameters
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="p-1 bg-white border border-slate-200 rounded">
                      <span className="text-slate-500 block">Min. Invest</span>
                      <strong className="text-slate-900 font-bold text-xs">₹{selectedPlan.minInvestAmount}</strong>
                    </div>
                    <div className="p-1 bg-white border border-slate-200 rounded">
                      <span className="text-slate-500 block">Daily ROI</span>
                      <strong className="text-emerald-700 font-bold text-xs">{selectedPlan.roi}%</strong>
                    </div>
                    <div className="p-1 bg-white border border-slate-200 rounded">
                      <span className="text-slate-500 block">Contract Period</span>
                      <strong className="text-slate-900 font-bold text-xs">{selectedPlan.period} Days</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Amount Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Investment Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.001"
                  required
                  disabled={modalLoading}
                  value={amount}
                  onChange={handleAmountChange}
                  onKeyDown={handleDecimalKeyDown}
                  placeholder={selectedPlan ? `Min. ₹${selectedPlan.minInvestAmount}` : 'Enter amount...'}
                  className="w-full px-3 py-1.5 bg-white border border-slate-400 rounded-[4px] text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-slate-50"
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  disabled={modalLoading}
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-400 hover:bg-slate-100 rounded-[4px] text-xs text-slate-700 font-extrabold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={modalLoading}
                  variant="primary"
                >
                  {modalLoading ? 'Processing...' : 'Confirm & Invest'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvestmentList;
