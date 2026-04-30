'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/axios';
import Navbar from '@/components/Navbar';

export default function ApplyPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    fullName: '',
    pan: '',
    dateOfBirth: '',
    monthlySalary: '',
    employmentMode: 'Salaried',
    salarySlipUrl: '',
    amount: 50000,
    tenure: 30,
  });

  const [result, setResult] = useState({
    interest: 0,
    total: 0,
  });

  const calculate = (amount: number, tenure: number) => {
    const interest = (amount * 12 * tenure) / (365 * 100);
    const total = amount + interest;
    setResult({
      interest: Math.round(interest),
      total: Math.round(total),
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/loans', {
        ...form,
        monthlySalary: Number(form.monthlySalary),
      });
      alert('🎉 Loan Applied Successfully');
      router.push('/my-loans');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center p-6 
        bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] text-white">

        <div className="w-full max-w-xl p-8 rounded-2xl 
          bg-white/10 backdrop-blur-xl border border-white/20 
          shadow-[0_8px_32px_rgba(0,0,0,0.37)]">

          <h1 className="text-2xl font-bold mb-6">
            Apply for Loan (Step {step}/3)
          </h1>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">

              <input
                placeholder="Full Name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <input
                placeholder="PAN"
                value={form.pan}
                onChange={(e) => setForm({ ...form, pan: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <input
                type="number"
                placeholder="Monthly Salary"
                value={form.monthlySalary}
                onChange={(e) => setForm({ ...form, monthlySalary: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <select
                value={form.employmentMode}
                onChange={(e) => setForm({ ...form, employmentMode: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option className="text-black">Salaried</option>
                <option className="text-black">Self-Employed</option>
                <option className="text-black">Unemployed</option>
              </select>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition"
              >
                Next →
              </button>

            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">

              <p className="text-sm text-gray-300">Upload Salary Slip</p>

              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
                className="text-sm text-gray-300"
              />

              {selectedFile && (
                <p className="text-sm text-green-400">
                  Selected: {selectedFile.name}
                </p>
              )}

              <button
                onClick={async () => {
                  if (!selectedFile) return alert('Please select a file');

                  setLoading(true);
                  try {
                    const formData = new FormData();
                    formData.append('file', selectedFile);

                    const res = await api.post('/upload/salary-slip', formData);

                    setForm({ ...form, salarySlipUrl: res.data.fileUrl });
                    setStep(3);
                  } catch (err: any) {
                    alert(err.response?.data?.message || 'Upload failed');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Upload & Continue →'}
              </button>

            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">

              <label className="text-sm text-gray-300">
                Loan Amount: ₹{form.amount}
              </label>
              <input
                type="range"
                min={50000}
                max={500000}
                value={form.amount}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setForm({ ...form, amount: val });
                  calculate(val, form.tenure);
                }}
                className="w-full accent-blue-400"
              />

              <label className="text-sm text-gray-300">
                Tenure: {form.tenure} days
              </label>
              <input
                type="range"
                min={30}
                max={365}
                value={form.tenure}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setForm({ ...form, tenure: val });
                  calculate(form.amount, val);
                }}
                className="w-full accent-purple-400"
              />

              <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                <p>Interest: ₹{result.interest}</p>
                <p>Total Repayment: ₹{result.total}</p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? 'Applying...' : 'Apply Loan'}
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}