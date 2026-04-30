'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import Navbar from '@/components/Navbar';

type Loan = {
  _id: string;
  amount: number;
  totalRepayment: number;
  outstandingBalance: number;
  borrower: {
    name: string;
    email: string;
  };
};

export default function CollectionDashboard() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [paymentData, setPaymentData] = useState<{
    [key: string]: {
      amount: string;
      utr: string;
    };
  }>({});

  const fetchLoans = async () => {
    try {
      const res = await api.get('/loans?status=DISBURSED');
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

  const handleChange = (loanId: string, field: string, value: string) => {
    setPaymentData((prev) => ({
      ...prev,
      [loanId]: {
        ...prev[loanId],
        [field]: value,
      },
    }));
  };

  const handlePayment = async (loanId: string) => {
    const data = paymentData[loanId];

    if (!data?.amount || !data?.utr) {
      return alert('Enter amount and UTR');
    }

    if (Number(data.amount) <= 0) {
      return alert('Amount must be greater than 0');
    }

    setProcessingId(loanId);

    try {
      await api.post(`/payments/${loanId}`, {
        amount: Number(data.amount),
        utr: data.utr,
        paymentDate: new Date().toISOString(),
      });

      alert('✅ Payment recorded');

      // clear inputs
      setPaymentData((prev) => ({
        ...prev,
        [loanId]: { amount: '', utr: '' },
      }));

      // refresh loans
      fetchLoans();

    } catch (err: any) {
      alert(err.response?.data?.message || 'Payment failed');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading collection dashboard...
      </div>
    );
  }

  return (
    <div>
        <Navbar />
    <div className="min-h-screen bg-black text-white">
    <div className="max-w-7xl mx-auto py-8 px-14">
      <h1 className="text-3xl font-bold mb-6">Collection Dashboard</h1>

      {loans.length === 0 ? (
        <p className="text-gray-400">No disbursed loans</p>
      ) : (
        <div className="space-y-5">

          {loans.map((loan) => (
            <div
              key={loan._id}
              className="bg-zinc-900 p-6 rounded-xl border border-zinc-800"
            >

              {/* Loan Info */}
              <div className="flex justify-between mb-3">
                <h2 className="text-lg font-semibold">
                  ₹{loan.amount}
                </h2>
                <span className="text-purple-400 text-sm">DISBURSED</span>
              </div>

              <p className="text-sm text-gray-400">
                {loan.borrower?.name} ({loan.borrower?.email})
              </p>

              <p className="text-sm mt-1">
                Total: ₹{loan.totalRepayment}
              </p>

              <p className="text-sm text-red-400">
                Outstanding: ₹{loan.outstandingBalance}
              </p>

              {/* Payment Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">

                <input
                  type="number"
                  placeholder="Enter Amount"
                  value={paymentData[loan._id]?.amount || ''}
                  onChange={(e) =>
                    handleChange(loan._id, 'amount', e.target.value)
                  }
                  className="p-2 rounded bg-zinc-800 border border-zinc-700"
                />

                <input
                  type="text"
                  placeholder="UTR Number"
                  value={paymentData[loan._id]?.utr || ''}
                  onChange={(e) =>
                    handleChange(loan._id, 'utr', e.target.value)
                  }
                  className="p-2 rounded bg-zinc-800 border border-zinc-700"
                />

                <button
                  onClick={() => handlePayment(loan._id)}
                  disabled={processingId === loan._id}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                >
                  {processingId === loan._id ? 'Processing...' : 'Record Payment'}
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