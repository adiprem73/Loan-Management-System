'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Navbar from '@/components/Navbar';

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

type Loan = {
  _id: string;
  amount: number;
  status: string;
  outstandingBalance: number;
  borrower: { name: string; email: string };
};

type Payment = {
  _id: string;
  amount: number;
  utr: string;
  createdAt: string;
  borrower: { name: string };
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const [users, setUsers] = useState<User[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [usersRes, loansRes, paymentsRes] = await Promise.all([
        api.get('/auth/users'),
        api.get('/loans'),
        api.get('/payments'),
      ]);

      setUsers(usersRes.data.users);
      setLoans(loansRes.data.loans);
      setPayments(paymentsRes.data.payments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading admin dashboard...
      </div>
    );
  }

  const totalDisbursed = loans
    .filter((l) => l.status === 'DISBURSED' || l.status === 'CLOSED')
    .reduce((acc, l) => acc + l.amount, 0);

  const activeLoans = loans.filter((l) => l.status !== 'CLOSED').length;

  return (
    <div>
      <Navbar />
      
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* TABS */}
      <div className="flex gap-4 mb-6">
        {['overview', 'users', 'loans', 'payments'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg capitalize ${
              activeTab === tab
                ? 'bg-purple-600'
                : 'bg-zinc-800 hover:bg-zinc-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ---------------- OVERVIEW ---------------- */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-4 gap-4">

          <Card title="Total Users" value={users.length} />
          <Card title="Total Loans" value={loans.length} />
          <Card title="Active Loans" value={activeLoans} />
          <Card title="Total Disbursed" value={`₹${totalDisbursed}`} />

        </div>
      )}

      {/* ---------------- USERS ---------------- */}
      {activeTab === 'users' && (
        <div className="space-y-3">
          {users.map((u) => (
            <div
              key={u._id}
              className="bg-zinc-900 p-4 rounded-lg flex justify-between"
            >
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-gray-400">{u.email}</p>
              </div>
              <span className="text-sm text-purple-400 capitalize">
                {u.role}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- LOANS ---------------- */}
      {activeTab === 'loans' && (
        <div className="space-y-3">
          {loans.map((loan) => (
            <div
              key={loan._id}
              className="bg-zinc-900 p-4 rounded-lg"
            >
              <div className="flex justify-between">
                <p className="font-medium">
                  ₹{loan.amount}
                </p>
                <span className="text-xs px-2 py-1 rounded bg-zinc-700">
                  {loan.status}
                </span>
              </div>

              <p className="text-sm text-gray-400">
                {loan.borrower?.name} ({loan.borrower?.email})
              </p>

              <p className="text-sm text-red-400">
                Outstanding: ₹{loan.outstandingBalance}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- PAYMENTS ---------------- */}
      {activeTab === 'payments' && (
        <div className="space-y-3">
          {payments.map((p) => (
            <div
              key={p._id}
              className="bg-zinc-900 p-4 rounded-lg flex justify-between"
            >
              <div>
                <p className="font-medium">₹{p.amount}</p>
                <p className="text-sm text-gray-400">
                  UTR: {p.utr}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm">{p.borrower?.name}</p>
                <p className="text-xs text-gray-500">
                  {new Date(p.createdAt).toLocaleDateString()}
                </p>
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

/* ---------- SMALL CARD COMPONENT ---------- */
function Card({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-xl font-semibold mt-2">{value}</p>
    </div>
  );
}