# Bank Account Type Hierarchy System - Project Report

## 1. Abstract
The "Bank Account Type Hierarchy System" is a production-ready, full-stack application designed to manage various banking accounts efficiently. Built using the MERN stack (MongoDB, Express.js, React.js, Node.js), this project serves as a practical implementation of core Object-Oriented Programming (OOP) principles—Abstraction, Encapsulation, Inheritance, and Polymorphism. By replacing redundant procedural logic with a clean class hierarchy and factory pattern, the system is highly maintainable, scalable, and demonstrates enterprise-level software engineering practices.

## 2. Introduction
Traditional banking software often suffers from duplicated logic, making maintenance difficult. This project introduces a robust architectural design where different account types (Savings, Current, Fixed Deposit) inherit from a central abstract `Account` class, ensuring code reuse and polymorphic behavior during execution.

## 3. Problem Statement
In many basic implementations, operations like `withdraw()` or `calculateInterest()` are implemented using massive `if/else` or `switch` statements scattered across the codebase. This leads to violations of the DRY (Don't Repeat Yourself) principle and makes the system fragile to changes.

## 4. Objectives
- Eliminate duplicated business logic using inheritance.
- Secure sensitive data (like balances) using encapsulation.
- Ensure correct account instantiation via the Factory Design Pattern.
- Provide a responsive, secure, and user-friendly interface.

## 5. Technology Stack
- **Frontend**: React.js, Vite, Bootstrap 5, Chart.js, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Security**: JWT Authentication, bcrypt hashing, Helmet

## 6. Implementation of OOP Principles
- **Abstraction**: Base `Account` class throws errors on direct instantiation. Common rules are abstracted.
- **Encapsulation**: Using `#` private class fields in Javascript to protect the `balance`.
- **Inheritance**: Subclasses automatically inherit `deposit()`, `validateAccount()`.
- **Polymorphism (Method Overriding)**: Each subclass implements its own `withdraw()` and `calculateInterest()` logic. Overdrafts, lock-in periods, and simple/compound interest are handled polymorphically.

## 7. Conclusion
This project successfully bridges theoretical OOP concepts with practical Full-Stack web development. It showcases how a clean backend architecture directly translates to a more robust, bug-free web application.
