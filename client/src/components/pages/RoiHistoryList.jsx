import { useState, useEffect } from 'react';
import { FaTimes, FaCoins } from 'react-icons/fa';
import api from '../../utils/api';

function RoiHistoryList() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch user ROI history records
  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/roi');
      if (data.status === 'success') {
        setHistory(data.history);
      } else {
        setError(data.message || 'Failed to retrieve ROI payout logs');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed. Make sure the server is online.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Filter records by plan name
  const filteredHistory = history.filter((log) => {
    const term = searchTerm.toLowerCase();
    const planName = log.investment?.planDetails?.planName || 'Standard Plan';
    return planName.toLowerCase().includes(term);
  });

  // Pagination calculations
  const totalItems = filteredHistory.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Single Card Container */}
      <div className="p-5 bg-white border border-slate-200 rounded-[4px] shadow-xs space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-4.5 bg-blue-600 rounded-full"></span>
            Daily ROI Payout History
          </h2>
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

        {/* ROI History Table */}
        {!loading && !error && (
          <>
            <div className="overflow-x-auto border border-slate-200 rounded-[4px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-800 font-extrabold bg-slate-100">
                    <th className="py-3 px-3 w-16">Sl. No.</th>
                    <th className="py-3 px-3">Plan Name</th>
                    <th className="py-3 px-3">Investment Principal</th>
                    <th className="py-3 px-3">ROI Rate</th>
                    <th className="py-3 px-3">Amount Credited</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentItems.map((log, idx) => {
                    const planName = log.investment?.planDetails?.planName || 'Standard Plan';
                    const principal = log.investment?.investmentAmount || 0;
                    const roiRate = log.investment?.dailyRoiPercentage || 1.0;
                    const isCredited = log.status === 'Credited';

                    return (
                      <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 text-slate-700 font-bold">
                          {indexOfFirstItem + idx + 1}
                        </td>
                        <td className="py-3 px-3 font-extrabold text-slate-900">
                          {planName}
                        </td>
                        <td className="py-3 px-3 text-slate-650 font-bold">
                          ₹{principal.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-semibold">
                          {roiRate.toFixed(2)}%
                        </td>
                        <td className="py-3 px-3 font-extrabold text-emerald-700">
                          +₹{log.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-extrabold border ${
                            isCredited
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-red-50 text-red-700 border-red-355'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-700 font-medium text-right">
                          {new Date(log.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                      </tr>
                    );
                  })}
                  {currentItems.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-slate-500 font-extrabold bg-slate-50">
                        No ROI (Return of Interest) record available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredHistory.length > 0 && (
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

export default RoiHistoryList;
