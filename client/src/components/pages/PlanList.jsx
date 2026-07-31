import { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaMinus, FaCoins, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import Button from '../ui/Button';

function PlanList() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planName, setPlanName] = useState('');
  const [roi, setRoi] = useState('');
  const [period, setPeriod] = useState('');
  const [minInvest, setMinInvest] = useState('');
  const [levels, setLevels] = useState(['']); // Start Level 1 as empty string (don't fill automatically)
  const [status, setStatus] = useState('Active'); // Status state
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  // SweetAlert Confirm State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Key filters to prevent entering e, E, -, + or dot inside numeric fields
  const handleDecimalKeyDown = (e) => {
    if (['e', 'E', '-', '+'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleIntegerKeyDown = (e) => {
    if (['e', 'E', '-', '+', '.'].includes(e.key)) {
      e.preventDefault();
    }
  };

  // 1. Daily ROI change handler (strips leading zeros, limits to max 3 decimal places, caps at 100)
  const handleRoiChange = (e) => {
    let val = e.target.value;
    val = val.replace(/^0+(?=\d)/, ''); // strip leading zeros (e.g. 02 -> 2)
    
    // Max 3 decimal places
    const parts = val.split('.');
    if (parts[1] && parts[1].length > 3) {
      val = parts[0] + '.' + parts[1].substring(0, 3);
    }
    
    // Max is 100
    const num = parseFloat(val);
    if (!isNaN(num) && num > 100) {
      val = '100';
    }
    setRoi(val);
  };

  // 2. Period change handler (strips leading zeros, accepts digits only)
  const handlePeriodChange = (e) => {
    let val = e.target.value;
    val = val.replace(/[^0-9]/g, ''); // digit characters only
    val = val.replace(/^0+(?=\d)/, ''); // strip leading zeros
    setPeriod(val);
  };

  // 3. Minimum investment change handler (strips leading zeros, max 3 decimal places)
  const handleMinInvestChange = (e) => {
    let val = e.target.value;
    val = val.replace(/^0+(?=\d)/, ''); // strip leading zeros
    
    const parts = val.split('.');
    if (parts[1] && parts[1].length > 3) {
      val = parts[0] + '.' + parts[1].substring(0, 3);
    }
    setMinInvest(val);
  };

  // 4. Level bonus change handler (strips leading zeros, max 3 decimal places, caps at 100)
  const handleLevelChange = (index, value) => {
    let val = value;
    val = val.replace(/^0+(?=\d)/, ''); // strip leading zeros
    
    const parts = val.split('.');
    if (parts[1] && parts[1].length > 3) {
      val = parts[0] + '.' + parts[1].substring(0, 3);
    }
    
    const num = parseFloat(val);
    if (!isNaN(num) && num > 100) {
      val = '100';
    }

    setLevels(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  // Fetch plans helper
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/plans');
      if (data.status === 'success') {
        setPlans(data.plans);
      } else {
        setError(data.message || 'Failed to fetch plans');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed. Make sure server is online.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleAddLevel = () => {
    setLevels(prev => [...prev, '']); // Add empty string (don't fill automatically)
  };

  const handleRemoveLevel = (index) => {
    if (levels.length > 1) {
      setLevels(prev => prev.filter((_, idx) => idx !== index));
    }
  };

  const handleCreatePlanSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    
    const parsedRoi = parseFloat(roi);
    const parsedPeriod = parseInt(period);
    const parsedMinInvest = parseFloat(minInvest);

    if (!planName.trim()) {
      setModalError('Plan Name is required');
      return;
    }
    if (isNaN(parsedRoi) || parsedRoi < 0 || parsedRoi > 100) {
      setModalError('Valid ROI percentage (0 to 100) is required');
      return;
    }
    if (isNaN(parsedPeriod) || parsedPeriod < 1) {
      setModalError('Valid Period (days) is required');
      return;
    }
    if (isNaN(parsedMinInvest) || parsedMinInvest < 0) {
      setModalError('Valid Minimum Investment is required');
      return;
    }

    // Verify all referral levels are filled correctly
    const parsedLevels = [];
    for (let i = 0; i < levels.length; i++) {
      const currentVal = parseFloat(levels[i]);
      if (isNaN(currentVal) || currentVal < 0 || currentVal > 100) {
        setModalError(`Referral commission percentage for Level ${i + 1} must be a number between 0 and 100`);
        return;
      }
      parsedLevels.push(currentVal);
    }

    setModalLoading(true);

    try {
      const { data } = await api.post('/plans', {
        planName: planName.trim(),
        roi: parsedRoi,
        period: parsedPeriod,
        minInvestAmount: parsedMinInvest,
        levelBonus: parsedLevels,
        status: status
      });

      if (data.status === 'success') {
        // Reset state and close modal
        setPlanName('');
        setRoi('');
        setPeriod('');
        setMinInvest('');
        setLevels(['']);
        setStatus('Active');
        setIsModalOpen(false);
        toast.success('New plan successfully created!');
        fetchPlans(); // Reload list
      } else {
        setModalError(data.message || 'Failed to create plan');
      }
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || 'Network error, please try again';
      setModalError(message);
    } finally {
      setModalLoading(false);
    }
  };

  // Click Handler for Delete Button (runs after custom modal confirmation)
  const handleDeletePlan = async (planId) => {
    try {
      const { data } = await api.delete(`/plans/${planId}`);
      if (data.status === 'success') {
        toast.success(data.message || 'Plan deleted successfully!');
        fetchPlans(); // Reload list
      } else {
        toast.error(data.message || 'Failed to complete action');
      }
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || 'Connection failed. Make sure the server is online.';
      toast.error(message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Table Card */}
      <div className="p-5 bg-white border border-slate-355 rounded-[4px] shadow-xs space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-4.5 bg-blue-600 rounded-full"></span>
            Investment Plans
          </h2>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="primary"
          >
            <FaPlus className="text-[10px] mr-1.5" /> Create Plan
          </Button>
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

        {/* Plans Table */}
        {!loading && !error && (
          <div className="overflow-x-auto border border-slate-200 rounded-[4px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-300 text-slate-800 font-extrabold bg-slate-100">
                  <th className="py-3 px-3 w-16">Sl. No.</th>
                  <th className="py-3 px-3">Plan Name</th>
                  <th className="py-3 px-3">Daily ROI</th>
                  <th className="py-3 px-3">Period</th>
                  <th className="py-3 px-3">Min. Investment</th>
                  <th className="py-3 px-3">Referral Commissions</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {plans.map((plan, idx) => (
                  <tr key={plan._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 text-slate-700 font-bold">{idx + 1}</td>
                    <td className="py-3 px-3 font-extrabold text-slate-900">{plan.planName}</td>
                    <td className="py-3 px-3 text-emerald-700 font-bold">{plan.roi.toFixed(2)}% Daily</td>
                    <td className="py-3 px-3 text-slate-800 font-bold">{plan.period} Days</td>
                    <td className="py-3 px-3 text-slate-900 font-bold">₹{plan.minInvestAmount.toFixed(2)}</td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1.5">
                        {plan.levelBonus.map((bonus, lvl) => (
                          <span 
                            key={lvl} 
                            className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-extrabold bg-blue-50 text-blue-750 border border-blue-200"
                          >
                            Lvl {lvl + 1}: {bonus}%
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-[10px] font-extrabold border ${
                        plan.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-amber-50 text-amber-700 border-amber-300'
                      }`}>
                        {plan.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(plan._id)}
                        className="px-2.5 py-1 text-[10px] font-extrabold border border-red-200 text-red-600 hover:bg-red-50 rounded-[4px] transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {plans.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-slate-500 font-extrabold bg-slate-50">
                      No active investment plans found. Click Create Plan to define one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Creation Modal Popup Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50 animate-overlay-in">
          <div className="bg-white border border-slate-300 w-full max-w-lg rounded-[4px] p-6 shadow-xl space-y-5 relative animate-modal-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <FaCoins className="text-blue-600 text-xs" /> Define Investment Plan
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreatePlanSubmit} className="space-y-4">
              {modalError && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-[4px] font-extrabold text-center">
                  {modalError}
                </div>
              )}

              {/* Name & Status Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Plan Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    disabled={modalLoading}
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    placeholder="e.g. Nexa Alpha 30D"
                    className="w-full px-3 py-1.5 bg-white border border-slate-400 rounded-[4px] text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-slate-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Status <span className="text-red-500">*</span></label>
                  <select
                    disabled={modalLoading}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-400 rounded-[4px] text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-slate-50"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Daily ROI % <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    disabled={modalLoading}
                    value={roi}
                    onChange={handleRoiChange}
                    onKeyDown={handleDecimalKeyDown}
                    placeholder="e.g. 1.500"
                    className="w-full px-3 py-1.5 bg-white border border-slate-400 rounded-[4px] text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-slate-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Period (Days) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    required
                    disabled={modalLoading}
                    value={period}
                    onChange={handlePeriodChange}
                    onKeyDown={handleIntegerKeyDown}
                    placeholder="e.g. 30"
                    className="w-full px-3 py-1.5 bg-white border border-slate-400 rounded-[4px] text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-slate-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Min. Invest (₹) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    disabled={modalLoading}
                    value={minInvest}
                    onChange={handleMinInvestChange}
                    onKeyDown={handleDecimalKeyDown}
                    placeholder="e.g. 500"
                    className="w-full px-3 py-1.5 bg-white border border-slate-400 rounded-[4px] text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-slate-50"
                  />
                </div>
              </div>

              {/* Dynamic Referral Levels */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 block">Referral Commissions per Level (%)</label>
                  <button
                    type="button"
                    disabled={modalLoading}
                    onClick={handleAddLevel}
                    className="text-[10px] text-blue-600 font-extrabold flex items-center hover:text-blue-800 cursor-pointer"
                  >
                    <FaPlus className="mr-1 text-[8px]" /> Add Level
                  </button>
                </div>

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {levels.map((val, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs text-slate-700 font-bold w-16">Lvl {idx + 1}:</span>
                      <input
                        type="number"
                        step="0.001"
                        required
                        disabled={modalLoading}
                        value={val}
                        onChange={(e) => handleLevelChange(idx, e.target.value)}
                        onKeyDown={handleDecimalKeyDown}
                        placeholder="Commission %"
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-400 rounded-[4px] text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-slate-50"
                      />
                      <button
                        type="button"
                        disabled={modalLoading || levels.length === 1}
                        onClick={() => handleRemoveLevel(idx)}
                        className="p-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-[4px] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <FaMinus className="text-[10px]" />
                      </button>
                    </div>
                  ))}
                </div>
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
                  {modalLoading ? 'Saving Plan...' : 'Save Plan'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirm Modal (SweetAlert style) */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50 animate-overlay-in">
          <div className="bg-white border border-slate-300 w-full max-w-sm rounded-[4px] p-6 shadow-xl space-y-4 text-center relative animate-modal-in">
            {/* Warning Icon */}
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto border border-amber-200">
              <FaExclamationTriangle className="text-lg" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-extrabold text-slate-950">Are you sure?</h3>
              <p className="text-xs text-slate-650 font-semibold leading-relaxed">
                Do you really want to delete or toggle the status of this plan? This action cannot be undone if deleted.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-1.5 border border-slate-400 hover:bg-slate-100 rounded-[4px] text-xs text-slate-700 font-extrabold transition-colors cursor-pointer"
              >
                No, cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetId = deleteConfirmId;
                  setDeleteConfirmId(null);
                  handleDeletePlan(targetId);
                }}
                className="px-4 py-1.5 bg-red-600 border border-red-650 hover:bg-red-750 hover:border-red-750 rounded-[4px] text-xs text-white font-extrabold transition-colors cursor-pointer"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanList;
