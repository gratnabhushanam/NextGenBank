# NextGen Banking Management System

A production-ready Full Stack Banking Management System built to demonstrate real-world banking operations while strictly adhering to Object-Oriented Programming (OOP) principles, Clean Architecture, and SOLID design patterns.

## Features

- **User Authentication:** Secure JWT & bcrypt based login and registration.
- **Dynamic Account Creation:** Open Savings, Current, or Fixed Deposit accounts with varying initial rules and data requirements.
- **Real-time Operations:** Deposit, Withdraw, and Transfer funds. All operations execute via secure MySQL database transactions ensuring data integrity.
- **OOP Core:** 
  - *Abstraction:* Base `Account` class forces implementation of `withdraw()` and `calculateInterest()`.
  - *Encapsulation:* Private fields (`#balance`) accessible only via controlled methods.
  - *Inheritance & Polymorphism:* `SavingsAccount`, `CurrentAccount`, and `FixedDepositAccount` inherit from `Account` but override methods based on specific banking rules.
  - *Factory Pattern:* `AccountFactory` handles dynamic instantiation of the correct subclass based on user input.
- **Admin Dashboard:** Monitor total system analytics, freeze/activate accounts, and view user metrics.
- **Strict UI Design:** Modern, fully responsive React interface strictly adhering to a corporate Blue/White color palette.

## Tech Stack

- **Frontend:** React.js, React Router DOM, Bootstrap 5, Chart.js, Axios
- **Backend:** Node.js, Express.js, Sequelize (ORM)
- **Database:** MySQL
- **Security:** JWT Authentication, bcrypt password hashing

## Installation & Setup

1. **Clone the repository**
2. **Setup Database:**
   - Install MySQL server locally.
   - Run `CREATE SCHEMA bankingsystem;` in your MySQL workbench.
   - Update `server/utils/db.js` with your root username and password.
3. **Start the Backend:**
   ```bash
   cd server
   npm install
   node server.js
   ```
4. **Start the Frontend:**
   ```bash
   cd client
   npm install
   npm run dev
   ```
5. **Access the Application:** Open `http://localhost:5173` in your browser.
