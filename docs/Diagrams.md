# Bank Account Type Hierarchy System - Project Diagrams

## 1. UML Class Diagram
This diagram illustrates the core Object-Oriented structure of the application.

```mermaid
classDiagram
    class Account {
        <<abstract>>
        -#accountNumber: string
        -#accountHolderName: string
        -#balance: number
        -#accountType: string
        +deposit(amount: number): number
        +withdraw(amount: number): number*
        +calculateInterest(): number*
        +getBalance(): number
        +validateAccount(): boolean
    }
    
    class SavingsAccount {
        -#withdrawalLimit: number
        -#interestRate: number
        +withdraw(amount: number): number
        +calculateInterest(): number
    }
    
    class CurrentAccount {
        -#overdraftLimit: number
        +withdraw(amount: number): number
        +calculateInterest(): number
    }
    
    class FixedDepositAccount {
        -#lockInPeriod: number
        -#penaltyPercentage: number
        +withdraw(amount: number): number
        +calculateInterest(): number
    }
    
    class AccountFactory {
        +createAccount(type, params): Account
    }

    Account <|-- SavingsAccount : Inheritance
    Account <|-- CurrentAccount : Inheritance
    Account <|-- FixedDepositAccount : Inheritance
    AccountFactory ..> Account : Instantiates
```

## 2. ER Diagram (Database Schema)

```mermaid
erDiagram
    USER ||--o{ ACCOUNT : "owns"
    ACCOUNT ||--o{ TRANSACTION : "has"
    
    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string role
    }
    
    ACCOUNT {
        ObjectId _id PK
        string accountNumber UK
        string accountType
        number balance
        string holderName
        string status
    }
    
    TRANSACTION {
        ObjectId _id PK
        string accountNumber FK
        string transactionType
        number amount
        number balanceAfterTransaction
        datetime date
    }
```

## 3. Architecture Diagram (MVC + Services)

```mermaid
flowchart TD
    Client[React.js Frontend] -->|HTTP Requests| API[Express.js Routes]
    API --> Controller[Controllers]
    Controller --> Factory[AccountFactory]
    Factory --> OOPClasses[Account, Savings, Current, FD]
    Controller --> Model[Mongoose Models]
    Model <--> MongoDB[(MongoDB)]
```
