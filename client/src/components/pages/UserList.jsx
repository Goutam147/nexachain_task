import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-white border border-slate-200 rounded-[4px] shadow-2xs">
        <h2 className="text-xl font-bold text-slate-800">User Directory</h2>
        <p className="text-xs text-slate-500 mt-1">
          Review, examine, and manage all users registered within the NexaChain AI ecosystem.
        </p>
      </div>

      {/* Users Directory Table */}
      <div className="p-5 bg-white border border-slate-200 rounded-[4px] shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <span className="w-1 h-3.5 bg-blue-600"></span> Registered Members Directory
        </h3>

        {loading && (
          <div className="py-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-[4px] text-xs text-red-600 font-medium">
            Error: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Member Name</th>
                  <th className="py-2.5 px-3">Email Address</th>
                  <th className="py-2.5 px-3">Mobile Number</th>
                  <th className="py-2.5 px-3">Referral Code</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Wallet Balance</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((member) => (
                  <tr key={member._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800">{member.fullName}</td>
                    <td className="py-3 px-3 text-slate-600">{member.email}</td>
                    <td className="py-3 px-3 text-slate-600">{member.mobileNumber}</td>
                    <td className="py-3 px-3 font-mono text-blue-600 font-bold">{member.referralCode}</td>
                    <td className="py-3 px-3 font-semibold text-slate-600 capitalize">{member.role}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">Rs. {member.walletBalance.toFixed(2)}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold border ${
                        member.accountStatus === 'Active' 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {member.accountStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-slate-400 font-semibold">
                      No registered members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserList;
