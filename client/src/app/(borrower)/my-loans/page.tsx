'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

type Loan = {
  _id: string;
  amount: number;
  totalRepayment: number;
  outstandingBalance: number;
  status: string;
  createdAt: string;
};

import Navbar from '@/components/Navbar';

export default function MyLoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await api.get('/loans/my-loans');
        setLoans(res.data.loans);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  // 📊 Stats
  const totalLoans = loans.length;
  const activeLoans = loans.filter(l => l.status !== 'CLOSED').length;
  const totalBorrowed = loans.reduce((sum, l) => sum + l.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400';
      case 'APPROVED': return 'bg-blue-500/20 text-blue-400';
      case 'REJECTED': return 'bg-red-500/20 text-red-400';
      case 'DISBURSED': return 'bg-purple-500/20 text-purple-400';
      case 'CLOSED': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading dashboard...
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
          {/* Header */}
          {/* <h1 className="text-3xl font-bold mb-6">Borrower Dashboard</h1> */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Borrower Dashboard</h1>

            <button
              onClick={() => (window.location.href = "/apply")}
              className="bg-gradient-to-r from-purple-500 to-blue-500 
    px-5 py-2 rounded-lg text-white text-sm font-medium 
    hover:opacity-90 transition"
            >
              + Apply Loan
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-zinc-900 p-5 rounded-xl">
              <p className="text-gray-400 text-sm">Total Loans</p>
              <h2 className="text-2xl font-bold">{totalLoans}</h2>
            </div>

            <div className="bg-zinc-900 p-5 rounded-xl">
              <p className="text-gray-400 text-sm">Active Loans</p>
              <h2 className="text-2xl font-bold">{activeLoans}</h2>
            </div>

            <div className="bg-zinc-900 p-5 rounded-xl">
              <p className="text-gray-400 text-sm">Total Borrowed</p>
              <h2 className="text-2xl font-bold">₹{totalBorrowed}</h2>
            </div>
          </div>

          {/* Loans List */}
          {loans.length === 0 ? (
            <div className="text-center mt-20 text-gray-400">
              <p>No loans found</p>
              <p className="text-sm mt-2">Apply for your first loan 🚀</p>
            </div>
          ) : (
            <div className="space-y-4">
              {loans.map((loan) => (
                <div
                  key={loan._id}
                  className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-zinc-700 transition"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">
                      Loan ₹{loan.amount}
                    </h2>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}
                    >
                      {loan.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                    <p>
                      Total Repayment:{" "}
                      <span className="text-white">₹{loan.totalRepayment}</span>
                    </p>
                    <p>
                      Outstanding:{" "}
                      <span className="text-white">
                        ₹{loan.outstandingBalance}
                      </span>
                    </p>
                    <p>
                      Applied On:{" "}
                      <span className="text-white">
                        {new Date(loan.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                  </div>

                  {/* Progress Bar (optional but cool) */}
                  <div className="mt-4">
                    <div className="w-full bg-zinc-800 h-2 rounded-full">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${(1 - loan.outstandingBalance / loan.totalRepayment) * 100}%`,
                        }}
                      />
                    </div>
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