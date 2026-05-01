"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Navbar from "@/components/Navbar";

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

type AuditLog = {
  _id: string;
  action: string;
  fromStatus?: string;
  toStatus?: string;
  note?: string;
  createdAt: string;
  performedBy: { name: string; role: string };
  loan: string;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const [users, setUsers] = useState<User[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [usersRes, loansRes, paymentsRes] = await Promise.all([
        api.get("/auth/users"),
        api.get("/loans"),
        api.get("/payments"),
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

  // Fetch audit logs for all loans
  const fetchAuditLogs = async (loans: Loan[]) => {
    try {
      const logPromises = loans.map((loan) =>
        api.get(`/loans/${loan._id}/audit`).then((res) => res.data.logs),
      );
      const allLogs = await Promise.all(logPromises);
      // Flatten and sort by date
      const flat = allLogs
        .flat()
        .sort(
          (a: AuditLog, b: AuditLog) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      setAuditLogs(flat);
    } catch (err) {
      console.error("Failed to fetch audit logs", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Once loans are loaded, fetch audit logs
  useEffect(() => {
    if (loans.length > 0) fetchAuditLogs(loans);
  }, [loans]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading admin dashboard...
      </div>
    );
  }

  const totalDisbursed = loans
    .filter((l) => l.status === "DISBURSED" || l.status === "CLOSED")
    .reduce((acc, l) => acc + l.amount, 0);

  const activeLoans = loans.filter((l) => l.status !== "CLOSED").length;

  const actionColor: Record<string, string> = {
    LOAN_APPLIED: "text-blue-400",
    LOAN_APPROVED: "text-green-400",
    LOAN_REJECTED: "text-red-400",
    LOAN_DISBURSED: "text-yellow-400",
    PAYMENT_RECORDED: "text-purple-400",
    LOAN_CLOSED: "text-gray-400",
  };

  return (
    <div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/50 rounded-full mix-blend-screen filter blur-[80px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/60 rounded-full mix-blend-screen filter blur-[80px] opacity-20 animate-pulse delay-1000"></div>
      <Navbar />

      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-14 py-8">
          {/* HEADER */}
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

          {/* TABS */}
          <div className="flex gap-4 mb-6 flex-wrap">
            {["overview", "users", "loans", "payments", "logs"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  activeTab === tab
                    ? "bg-purple-600"
                    : "bg-zinc-800 hover:bg-zinc-700"
                }`}
              >
                {tab}
                {tab === "logs" && auditLogs.length > 0 && (
                  <span className="ml-2 bg-purple-800 text-xs px-1.5 py-0.5 rounded-full">
                    {auditLogs.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid md:grid-cols-4 gap-4">
              <Card title="Total Users" value={users.length} />
              <Card title="Total Loans" value={loans.length} />
              <Card title="Active Loans" value={activeLoans} />
              <Card
                title="Total Disbursed"
                value={`₹${totalDisbursed.toLocaleString()}`}
              />
            </div>
          )}

          {/* USERS */}
          {activeTab === "users" && (
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

          {/* LOANS */}
          {activeTab === "loans" && (
            <div className="space-y-3">
              {loans.map((loan) => (
                <div key={loan._id} className="bg-zinc-900 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <p className="font-medium">
                      ₹{loan.amount.toLocaleString()}
                    </p>
                    <span className="text-xs px-2 py-1 rounded bg-zinc-700">
                      {loan.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {loan.borrower?.name} ({loan.borrower?.email})
                  </p>
                  <p className="text-sm text-red-400">
                    Outstanding: ₹{loan.outstandingBalance.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* PAYMENTS */}
          {activeTab === "payments" && (
            <div className="space-y-3">
              {payments.map((p) => (
                <div
                  key={p._id}
                  className="bg-zinc-900 p-4 rounded-lg flex justify-between"
                >
                  <div>
                    <p className="font-medium">₹{p.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">UTR: {p.utr}</p>
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

          {/* AUDIT LOGS */}
          {activeTab === "logs" && (
            <div className="space-y-3">
              {auditLogs.length === 0 ? (
                <p className="text-gray-500 text-sm">No audit logs found.</p>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log._id}
                    className="bg-zinc-900 p-4 rounded-lg border border-zinc-800"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span
                          className={`font-medium text-sm ${actionColor[log.action] || "text-white"}`}
                        >
                          {log.action.replace(/_/g, " ")}
                        </span>
                        {log.fromStatus && log.toStatus && (
                          <span className="text-xs text-gray-500 ml-2">
                            {log.fromStatus} → {log.toStatus}
                          </span>
                        )}
                        {log.note && (
                          <p className="text-xs text-gray-400 mt-1">
                            {log.note}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          By: {log.performedBy?.name} ({log.performedBy?.role})
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 whitespace-nowrap ml-4">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-xl font-semibold mt-2">{value}</p>
    </div>
  );
}
