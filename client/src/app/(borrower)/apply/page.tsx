'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/axios';



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

  // 🧮 Loan calculation (same as backend)
  const calculate = (amount: number, tenure: number) => {
    const interest = (amount * 12 * tenure) / (365 * 100);
    const total = amount + interest;
    setResult({
      interest: Math.round(interest),
      total: Math.round(total),
    });
  };

  // 📤 Upload file
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post('/upload/salary-slip', formData);
    setForm({ ...form, salarySlipUrl: res.data.fileUrl });
    setStep(3);
  };

  // 🚀 Submit loan
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
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-zinc-900 p-8 rounded-2xl shadow-lg">

        <h1 className="text-2xl font-bold mb-6">
          Apply for Loan (Step {step}/3)
        </h1>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">

            <input
              placeholder="Full Name"
              className="input"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />

            <input
              placeholder="PAN"
              className="input"
              value={form.pan}
              onChange={(e) => setForm({ ...form, pan: e.target.value })}
            />

            <input
              type="date"
              className="input"
              value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            />

            <input
              type="number"
              placeholder="Monthly Salary"
              className="input"
              value={form.monthlySalary}
              onChange={(e) => setForm({ ...form, monthlySalary: e.target.value })}
            />

            <select
              className="input"
              value={form.employmentMode}
              onChange={(e) => setForm({ ...form, employmentMode: e.target.value })}
            >
              <option>Salaried</option>
              <option>Self-Employed</option>
              <option>Unemployed</option>
            </select>

            <button
              onClick={() => setStep(2)}
              className="btn"
            >
              Next →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
  <div className="space-y-4">

    <p className="text-sm text-gray-400">Upload Salary Slip</p>

    <input
      type="file"
      onChange={(e) => {
        if (e.target.files) {
          setSelectedFile(e.target.files[0]);
        }
      }}
    />

    {/* Show selected file */}
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
      className="btn"
      disabled={loading}
    >
      {loading ? 'Uploading...' : 'Upload & Continue →'}
    </button>

  </div>
)}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-4">

            <label>Loan Amount: ₹{form.amount}</label>
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
            />

            <label>Tenure: {form.tenure} days</label>
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
            />

            <div className="bg-zinc-800 p-4 rounded-lg">
              <p>Interest: ₹{result.interest}</p>
              <p>Total Repayment: ₹{result.total}</p>
            </div>

            <button
              onClick={handleSubmit}
              className="btn"
              disabled={loading}
            >
              {loading ? 'Applying...' : 'Apply Loan'}
            </button>

          </div>
        )}

      </div>

      {/* Tailwind helpers */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          background: #27272a;
          border: 1px solid #3f3f46;
        }
        .btn {
          width: 100%;
          background: #2563eb;
          padding: 12px;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}