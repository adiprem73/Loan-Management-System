# 🏦 Loan Management System (LMS)

A full-stack lending platform built with the MERN stack + Next.js, where borrowers can apply for loans and internal executives manage them through their complete lifecycle.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue) ![Next.js](https://img.shields.io/badge/Frontend-Next.js_16-black) ![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue) ![MongoDB](https://img.shields.io/badge/Database-MongoDB_Atlas-green)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Seed Credentials](#seed-credentials)
- [API Reference](#api-reference)
- [Loan Lifecycle](#loan-lifecycle)
- [Role-Based Access Control](#role-based-access-control)
- [Business Rule Engine](#business-rule-engine)

---

## ✨ Features

### Borrower Portal
- Secure signup & login (JWT + bcrypt)
- Multi-step loan application form
- **Business Rule Engine (BRE)** validation — age, salary, PAN, employment checks
- Salary slip upload (PDF/JPG/PNG, max 5MB)
- Live loan calculator with Simple Interest formula
- Loan status tracking

### Operations Dashboard
- **Sales** — Lead tracking (registered users who haven't applied)
- **Sanction** — Approve or reject pending loan applications
- **Disbursement** — Release funds for approved loans
- **Collection** — Record payments with unique UTR numbers, auto-close on full repayment
- **Admin** — Full visibility across all modules + audit logs

### Extra Features
- Complete audit trail for every loan status change
- Auto loan closure when outstanding balance reaches zero
- UTR uniqueness enforcement at database level
- Role-based access control on both frontend AND backend

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router) + TypeScript + Tailwind CSS |
| Backend | Node.js + Express.js + TypeScript |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcrypt |
| State Management | Zustand |
| HTTP Client | Axios |

---

## 📁 Project Structure

```
loan-management-system/
├── client/                          # Next.js frontend
│   └── src/
│       ├── app/
│       │   ├── (auth)/
│       │   │   ├── login/
│       │   │   └── register/
│       │   ├── (borrower)/
│       │   │   ├── apply/
│       │   │   └── my-loans/
│       │   └── (dashboard)/
│       │       ├── admin/
│       │       ├── sales/
│       │       ├── sanction/
│       │       ├── disbursement/
│       │       └── collection/
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       ├── store/
│       └── types/
│
└── server/                          # Express backend
    └── src/
        ├── config/
        ├── engine/                  # BRE logic
        ├── middleware/              # Auth + RBAC
        ├── models/                  # Mongoose schemas
        ├── modules/
        │   ├── auth/
        │   ├── loan/
        │   ├── payment/
        │   └── upload/
        ├── seed/                    # Pre-create role accounts
        └── utils/                   # Loan math utilities
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- MongoDB Atlas account (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/loan-management-system.git
cd loan-management-system
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory (see [Environment Variables](#environment-variables)):

```bash
cp .env.example .env
# Fill in your values
```

Run the seed script to create all role accounts:

```bash
npm run seed
```

Start the development server:

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 3. Setup the Frontend

```bash
cd ../client
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## 🔐 Environment Variables

### `server/.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/lms?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### `server/.env.example`

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/lms?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

> **How to get MONGO_URI:**
> 1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
> 2. Create a free M0 cluster
> 3. Go to Connect → Drivers → Node.js
> 4. Copy the connection string and replace `<password>` with your DB user password
> 5. Add `/lms` before the `?` to specify the database name

---

## 👤 Seed Credentials

After running `npm run seed`, these accounts are available:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lms.com | Admin@123 |
| Sales | sales@lms.com | Sales@123 |
| Sanction | sanction@lms.com | Sanction@123 |
| Disbursement | disbursement@lms.com | Disburse@123 |
| Collection | collection@lms.com | Collection@123 |
| Borrower | borrower@lms.com | Borrower@123 |

---

## 📡 API Reference

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register as borrower |
| POST | `/api/auth/login` | Public | Login for all roles |
| GET | `/api/auth/me` | Protected | Get current user |
| GET | `/api/auth/users` | Admin | Get all users |

### Loans

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/loans` | Borrower | Apply for a loan (runs BRE) |
| GET | `/api/loans/my-loans` | Borrower | Get own loans |
| GET | `/api/loans` | Executives + Admin | Get all loans |
| GET | `/api/loans/:id` | All roles | Get loan by ID |
| PATCH | `/api/loans/:id/sanction` | Sanction + Admin | Approve or reject |
| PATCH | `/api/loans/:id/disburse` | Disbursement + Admin | Disburse loan |
| GET | `/api/loans/:id/audit` | Executives + Admin | Get audit trail |

### Payments

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/payments/:loanId` | Collection + Admin | Record payment |
| GET | `/api/payments/:loanId` | Executives + Admin | Get payments for loan |
| GET | `/api/payments` | Collection + Admin | Get all payments |

### Upload

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/upload/salary-slip` | Borrower | Upload salary slip |

---

## 🔄 Loan Lifecycle

```
Borrower Applies
      │
      ▼
   PENDING  ──── Sanction Rejects ────► REJECTED
      │
      │ Sanction Approves
      ▼
   APPROVED
      │
      │ Disbursement Disburses
      ▼
  DISBURSED
      │
      │ Collection records payments
      │ (outstanding balance reduces)
      ▼
   CLOSED (auto-closes when fully paid)
```

---

## 🔒 Role-Based Access Control

| Role | Access |
|------|--------|
| Borrower | Application portal only (`/apply`, `/my-loans`) |
| Sales | Sales module (`/dashboard/sales`) |
| Sanction | Sanction module (`/dashboard/sanction`) |
| Disbursement | Disbursement module (`/dashboard/disbursement`) |
| Collection | Collection module (`/dashboard/collection`) |
| Admin | All modules + all data |

> Access control is enforced on **both frontend AND backend**. The API returns `403 Forbidden` for unauthorized role access — hiding UI elements alone is not sufficient.

---

## ⚙️ Business Rule Engine (BRE)

The BRE runs server-side on every loan application. All rules must pass:

| Rule | Condition |
|------|-----------|
| Age | Must be between 23 and 50 years |
| Monthly Salary | Must be at least ₹25,000 |
| PAN Format | Must match format: `ABCDE1234F` |
| Employment | Must not be Unemployed |

If any rule fails, the application is blocked with a clear error message.

---

## 💰 Loan Math

Uses Simple Interest formula:

```
SI = (P × R × T) / (365 × 100)

Where:
  P = Principal amount
  R = 12% per annum (fixed)
  T = Tenure in days

Total Repayment = P + SI
```

---

## 📝 Scripts

### Server

```bash
npm run dev      # Start development server with nodemon
npm run seed     # Seed all role accounts into database
npm run build    # Compile TypeScript to JavaScript
```

### Client

```bash
npm run dev      # Start Next.js development server
npm run build    # Build for production
npm run start    # Start production server
```

---

## 🧪 Testing the Flow

1. Login as **borrower** → apply for a loan → verify BRE pass and fail cases
2. Login as **sanction** → approve the loan
3. Login as **disbursement** → disburse the loan
4. Login as **collection** → record a payment with a unique UTR
5. Record payments until outstanding balance = 0 → loan auto-closes
6. Login as **admin** → verify full visibility + audit logs

---

## 📄 License

MIT
