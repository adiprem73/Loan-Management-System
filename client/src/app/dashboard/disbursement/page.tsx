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

export default function DisbursementDashboard() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchLoans = async () => {
    try {
      const res = await api.get('/loans?status=APPROVED');
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

  const handleDisburse = async (id: string) => {
    setActionLoading(id);

    try {
      await api.patch(`/loans/${id}/disburse`);
      
      // remove loan from UI instantly
      setLoans((prev) => prev.filter((loan) => loan._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Disbursement failed');
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
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/50 rounded-full mix-blend-screen filter blur-[80px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/60 rounded-full mix-blend-screen filter blur-[80px] opacity-20 animate-pulse delay-1000"></div>
      <Navbar />

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto py-8 px-14">
          <h1 className="text-3xl font-bold mb-6">Disbursement Dashboard</h1>

          {loans.length === 0 ? (
            <p className="text-gray-400">No approved loans</p>
          ) : (
            <div className="space-y-4">
              {loans.map((loan) => (
                <div
                  key={loan._id}
                  className="bg-zinc-900 p-6 rounded-xl border border-zinc-800"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold">₹{loan.amount}</h2>
                    <span className="text-blue-400 text-sm">APPROVED</span>
                  </div>

                  <p className="text-sm text-gray-400">
                    Borrower: {loan.borrower?.name} ({loan.borrower?.email})
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    Repayment: ₹{loan.totalRepayment}
                  </p>

                  <button
                    onClick={() => handleDisburse(loan._id)}
                    disabled={actionLoading === loan._id}
                    className="mt-4 px-4 py-2 bg-purple-600 rounded-lg"
                  >
                    {actionLoading === loan._id
                      ? "Processing..."
                      : "Disburse 💸"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}