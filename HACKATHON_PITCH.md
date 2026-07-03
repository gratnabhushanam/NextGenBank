# 🚀 NextGen Bank - Hackathon Pitch & Project Report

Welcome to the **NextGen Bank** repository! This document serves as a comprehensive guide and pitch report for the hackathon mentors, explaining our architecture, core features, and deployment strategies.

---

## 📖 Executive Summary
NextGen Bank is a modern, fully-featured digital banking platform designed to simulate a real-world financial institution. Built with a robust **React (Vite)** frontend and an **Express/Node.js** backend connected to a **MySQL** database, it provides role-based access control for Customers, Employees, Managers, and Admins.

Our goal was to create a seamless, paperless banking experience featuring automated KYC verification processes, dynamic loan originations, and real-time transaction tracking.

---

## 🏗️ Architecture & Tech Stack

### Frontend (Client)
- **Framework**: React 19 + Vite
- **Styling**: Bootstrap 5 + custom CSS for a premium, responsive UI
- **Routing**: React Router DOM (Protected Routes based on JWT Roles)
- **Data Visualization**: Chart.js for financial insights
- **State Management**: React Context API for Global Auth State

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (Relational data integrity for financial records)
- **ORM**: Sequelize (Object-Relational Mapping for robust queries)
- **Security**: Helmet, CORS, Express Rate Limit, bcrypt (password hashing)
- **Authentication**: JSON Web Tokens (JWT)

---

## ✨ Core Features

### 1. Role-Based Access Control (RBAC)
The system elegantly handles 4 distinct user roles, each with custom dashboards and permissions:
- **Customer**: Can view balances, download statements, apply for loans, and upload KYC documents.
- **Employee**: Can physically verify KYC documents in-branch and seamlessly open new bank accounts for walk-in customers.
- **Manager**: Holds approval authority. Managers approve or reject Loan Applications and oversee Employee KYC verifications.
- **Admin**: Has overarching system control to manage internal bank staff.

### 2. Comprehensive Loan Engine
- **Dynamic Interest Rates**: The system automatically calculates interest rates based on the loan type (e.g., Education Loan at 2.5%, Property Loan at 8.5%).
- **Document Uploads**: Integrated Multer for secure uploading of PAN Cards, Aadhaar Cards, and Property Collateral documents directly during the loan application.
- **Automated Disbursement**: When a Manager approves a loan, the backend automatically locates the customer's savings account and credits the loan amount, instantly generating a ledger transaction.

### 3. KYC (Know Your Customer) Pipeline
- Customers upload identity documents securely.
- Employees verify the physical/digital copies.
- Unverified customers are restricted from performing high-risk actions (like applying for loans) until their status is verified.

### 4. Financial Ledger & Statements
- Every deposit, withdrawal, and loan disbursement is tracked in an immutable `Transactions` table.
- Customers can instantly generate and download **PDF Bank Statements** using `jspdf`.

---

## 🚀 Deployment Guide

This project is built to be cloud-native and easily deployable.

### Frontend Deployment (Vercel)
The frontend is optimized for **Vercel**.
1. Import the GitHub repository into Vercel.
2. Set the **Root Directory** to `client`.
3. Set the Build Command to `npm run build` and Output Directory to `dist`.
4. Add the `VITE_API_URL` environment variable pointing to the Render backend.
*(A `vercel.json` file is included in the `client` directory to handle SPA routing automatically).*

### Backend Deployment (Render)
The backend is optimized for **Render**.
1. Import the GitHub repository into Render and create a new **Web Service**.
2. Set the **Root Directory** to `server`.
3. Set the Build Command to `npm install`.
4. Set the Start Command to `npm start` (which runs `node server.js`).
5. Add all required Environment Variables (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `JWT_SECRET`, etc.).

---

## 💡 Why NextGen Bank Stands Out
We focused heavily on **Real-World Business Logic**. Instead of just a simple CRUD app, NextGen Bank implements the actual workflows a bank uses:
- Separation of duties (Employees prepare, Managers approve).
- ACID-compliant relational data structures for money handling.
- Security-first approach with JWTs, bcrypt hashing, and protected routes.

Thank you for reviewing our project! We are excited to present NextGen Bank.
