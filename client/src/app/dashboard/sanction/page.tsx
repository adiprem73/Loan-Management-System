'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Navbar from '@/components/Navbar';
type Loan = {
  _id: string;
  amount: number;
  totalRepayment: number;
  status: string;
  borrower: {
    name: string;
    email: string;
  };
};

export default function SanctionDashboard() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchLoans = async () => {
    try {
      const res = await api.get('/loans?status=PENDING');
      setLoans(res.data.loans);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleAction = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    setActionLoading(id);

    try {
      await api.patch(`/loans/${id}/sanction`, {
        action: action,
        remark: action === 'REJECTED' ? 'Rejected by officer' : '',
      });

      // remove from list instantly
      setLoans((prev) => prev.filter((loan) => loan._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <Navbar />
    
    <div className="min-h-screen bg-black text-white">
      <div className = "max-w-7xl mx-auto py-8 px-14">
      <h1 className="text-3xl font-bold mb-6">Sanction Dashboard</h1>

      {loans.length === 0 ? (
        <p className="text-gray-400">No pending loans</p>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <div
              key={loan._id}
              className="bg-zinc-900 p-6 rounded-xl border border-zinc-800"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">
                  ₹{loan.amount}
                </h2>
                <span className="text-yellow-400 text-sm">PENDING</span>
              </div>

              <p className="text-sm text-gray-400">
                Borrower: {loan.borrower?.name} ({loan.borrower?.email})
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Repayment: ₹{loan.totalRepayment}
              </p>

              <div className="flex gap-3 mt-4">

                <button
                  onClick={() => handleAction(loan._id, 'APPROVED')}
                  disabled={actionLoading === loan._id}
                  className="px-4 py-2 bg-green-600 rounded-lg"
                >
                  {actionLoading === loan._id ? 'Processing...' : 'Approve'}
                </button>

                <button
                  onClick={() => handleAction(loan._id, 'REJECTED')}
                  disabled={actionLoading === loan._id}
                  className="px-4 py-2 bg-red-600 rounded-lg"
                >
                  Reject
                </button>

              </div>

            </div>
          ))}
        </div>
      )}
  </div>
  </div>
    </div>
  );
}