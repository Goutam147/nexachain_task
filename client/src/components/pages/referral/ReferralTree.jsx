import { useState, useEffect } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { FaSitemap, FaUsers, FaCopy, FaCheck, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';

// Helper to count users in each level of the tree recursively
const calculateStats = (rootNode) => {
  if (!rootNode) return { total: 0, l1: 0, l2: 0, l3: 0, l4Plus: 0 };
  let total = 0;
  let l1 = 0;
  let l2 = 0;
  let l3 = 0;
  let l4Plus = 0;

  const traverse = (node, depth) => {
    if (!node.children) return;
    node.children.forEach(child => {
      total++;
      if (depth === 1) l1++;
      else if (depth === 2) l2++;
      else if (depth === 3) l3++;
      else l4Plus++;
      traverse(child, depth + 1);
    });
  };

  traverse(rootNode, 1);

  return {
    total,
    l1,
    l2,
    l3,
    l4Plus
  };
};

const Node = ({ node, isRoot }) => {
  const isActive = node.accountStatus === 'Active';
  
  return (
    <div className={`relative inline-block p-3.5 text-center min-w-[140px] max-w-[160px] bg-white border rounded-[8px] shadow-xs transition-all duration-300 hover:shadow-md hover:scale-105 ${
      isRoot 
        ? 'border-blue-500 ring-2 ring-blue-100' 
        : 'border-slate-200'
    }`}>
      {/* Active/Inactive Dot Indicator */}
      <span 
        className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`}
        title={node.accountStatus}
      />
      
      <div className="text-xs font-extrabold text-slate-900 truncate pr-2">{node.fullName}</div>
      <div className="text-[9px] text-slate-500 truncate font-semibold mt-0.5">{node.email}</div>
    </div>
  );
};

function ReferralTree() {
  const { user } = useAuth();
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchTree = async () => {
    try {
      const { data } = await api.get('/referrals/tree');
      if (data.status === 'success') {
        setTreeData(data.tree);
      } else {
        setError(data.message || 'Failed to fetch referral tree');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed. Make sure the server is online.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, []);

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

  // Recursively render node children
  const renderTreeNodes = (nodes) => {
    if (!nodes || nodes.length === 0) return null;
    return nodes.map((node) => (
      <TreeNode key={node._id} label={<Node node={node} />}>
        {renderTreeNodes(node.children)}
      </TreeNode>
    ));
  };

  const stats = calculateStats(treeData);

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Top Header Row with Referral Code */}
      <div className="p-4 bg-white border border-slate-200 rounded-[4px] shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-4.5 bg-blue-600 rounded-full"></span>
            Referral Downline Tree
          </h2>
        </div>
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

      {/* Network Stats Cards */}
      {!loading && !error && treeData && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 bg-white border border-slate-200 rounded-[4px] text-center shadow-xs">
            <span className="text-[10px] text-slate-550 font-bold block">Total Network</span>
            <strong className="text-lg font-black text-slate-900">{stats.total}</strong>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-[4px] text-center shadow-xs">
            <span className="text-[10px] text-slate-550 font-bold block">Level 1 Direct</span>
            <strong className="text-lg font-black text-blue-650">{stats.l1}</strong>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-[4px] text-center shadow-xs">
            <span className="text-[10px] text-slate-550 font-bold block">Level 2 Indirect</span>
            <strong className="text-lg font-black text-slate-700">{stats.l2}</strong>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-[4px] text-center shadow-xs">
            <span className="text-[10px] text-slate-550 font-bold block">Level 3 Indirect</span>
            <strong className="text-lg font-black text-slate-700">{stats.l3}</strong>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-[4px] text-center shadow-xs col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-550 font-bold block">Level 4+ Indirect</span>
            <strong className="text-lg font-black text-slate-700">{stats.l4Plus}</strong>
          </div>
        </div>
      )}

      {/* Tree Visualization Card */}
      <div className="p-5 bg-white border border-slate-200 rounded-[4px] shadow-xs flex flex-col space-y-4">
        {/* Info bar */}
        <div className="flex items-center gap-1.5 p-2.5 bg-blue-50/50 border border-blue-200 rounded-[4px] text-[10px] text-blue-900 font-semibold">
          <FaInfoCircle className="text-blue-500 text-xs shrink-0" />
          <span>Use horizontal and vertical scrollbars inside the viewport below to navigate deep branches in your network.</span>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-[4px] text-xs text-red-700 font-extrabold">
            Error: {error}
          </div>
        )}

        {/* Scrollable Viewport for Tree */}
        {!loading && !error && treeData && (
          <div className="border border-slate-200 rounded-[4px] bg-slate-50/50 overflow-x-auto overflow-y-auto max-h-[500px] p-6 flex justify-start sm:justify-center items-start min-h-[350px]">
            <div className="min-w-max p-4">
              {stats.total === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400 max-w-sm mx-auto">
                  <FaSitemap className="text-3xl" />
                  <p className="text-xs font-bold text-center">Your referral network is currently empty. Direct referrals will show up here as branch nodes.</p>
                </div>
              ) : (
                <Tree
                  lineColor="#cbd5e1"
                  lineWidth="2px"
                  lineHeight="32px"
                  lineBorderRadius="8px"
                  label={<Node node={treeData} isRoot={true} />}
                >
                  {renderTreeNodes(treeData.children)}
                </Tree>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReferralTree;
