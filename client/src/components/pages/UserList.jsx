import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { FaTimes } from 'react-icons/fa';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = Cookies.get('token');
      try {
        const response = await fetch('http://localhost:5000/api/auth/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.status === 'success') {
          setUsers(data.users);
        } else {
          setError(data.message || 'Failed to fetch users list');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Connection failed. Make sure the server is online.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 1. Client-side Search filter
  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.fullName?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.mobileNumber?.toLowerCase().includes(term) ||
      user.referralCode?.toLowerCase().includes(term) ||
      user.role?.toLowerCase().includes(term) ||
      user.accountStatus?.toLowerCase().includes(term)
    );
  });

  // 2. Client-side Pagination maths
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const startEntryNumber = totalItems === 0 ? 0 : indexOfFirstItem + 1;
  const endEntryNumber = Math.min(indexOfLastItem, totalItems);

  // Navigate pages
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Generate page numbers array for pagination buttons
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Single card containing all tools, searches, and data table */}
      <div className="p-5 bg-white border border-slate-300 rounded-[4px] shadow-xs space-y-4">
        
        {/* Card Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-4.5 bg-blue-600 rounded-full"></span>
            User Directory
          </h2>
          {/* Search Input */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset page to 1 on search
              }}
              className="w-full sm:w-64 pl-3 pr-8 py-1.5 bg-white border border-slate-400 rounded-[4px] text-xs text-slate-900 placeholder-slate-500 font-semibold focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                className="absolute right-2.5 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <FaTimes className="text-xs" />
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

        {/* Table Content */}
        {!loading && !error && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-slate-200 rounded-[4px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-800 font-extrabold bg-slate-100">
                    <th className="py-3 px-3 w-16">Sl. No.</th>
                    <th className="py-3 px-3">Member Name</th>
                    <th className="py-3 px-3">Email Address</th>
                    <th className="py-3 px-3">Mobile Number</th>
                    <th className="py-3 px-3">Referral Code</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Wallet Balance</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentItems.map((member, idx) => (
                    <tr key={member._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 text-slate-700 font-bold">
                        {indexOfFirstItem + idx + 1}
                      </td>
                      <td className="py-3 px-3 text-slate-900">{member.fullName}</td>
                      <td className="py-3 px-3 text-slate-800 font-bold">{member.email}</td>
                      <td className="py-3 px-3 text-slate-800 font-bold">{member.mobileNumber}</td>
                      <td className="py-3 px-3 font-mono text-blue-700 font-extrabold">{member.referralCode}</td>
                      <td className="py-3 px-3 font-bold text-slate-750 capitalize">{member.role}</td>
                      <td className="py-3 px-3 text-slate-900">₹{member.walletBalance.toFixed(2)}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-[10px] font-extrabold border ${
                          member.accountStatus === 'Active' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-amber-50 text-amber-700 border-amber-300'
                        }`}>
                          {member.accountStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-slate-500 font-extrabold bg-slate-50">
                        No matching members found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-4 border-t border-slate-200 text-xs text-slate-800 font-bold gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Entries Page Selector */}
                <div className="flex items-center gap-1.5 text-xs text-slate-800 font-bold">
                  <span>Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1); // Reset to first page
                    }}
                    className="bg-white border border-slate-400 rounded-[4px] px-2 py-1 text-xs text-slate-850 font-bold focus:outline-none focus:border-blue-650"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span>entries</span>
                </div>

                <div>
                  Showing <strong className="text-slate-950">{startEntryNumber}</strong> to <strong className="text-slate-950">{endEntryNumber}</strong> of <strong className="text-slate-950">{totalItems}</strong> entries
                  {searchTerm && ` (filtered from ${users.length} total entries)`}
                </div>
              </div>

              {/* Clickable Pagination Page Numbers */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={handlePrevPage}
                  className="px-3 py-1.5 border border-slate-400 rounded-[4px] hover:bg-slate-100 text-xs text-slate-800 font-extrabold transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 border rounded-[4px] text-xs font-extrabold transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'border-slate-400 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={handleNextPage}
                  className="px-3 py-1.5 border border-slate-400 rounded-[4px] hover:bg-slate-100 text-xs text-slate-800 font-extrabold transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserList;
