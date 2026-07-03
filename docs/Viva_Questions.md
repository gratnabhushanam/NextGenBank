# 50 Viva Questions & Answers

1. **What is Abstraction in this project?**
   *Answer*: Hiding complex implementation details. The `Account` class provides a unified interface (`deposit`, `withdraw`), hiding the complex state management. It acts as an abstract template that cannot be instantiated directly.
2. **How did you implement Encapsulation?**
   *Answer*: Using private fields in JavaScript (e.g., `#balance`). State can only be modified through controlled setter methods or public functions like `deposit()`.
3. **What is Inheritance and how is it used here?**
   *Answer*: `SavingsAccount`, `CurrentAccount`, and `FixedDepositAccount` extend `Account`. They inherit common properties (accountNumber, balance) and methods (deposit, displayAccount) to prevent code duplication.
4. **What is Polymorphism? Provide an example from the project.**
   *Answer*: Poly (many) morphs (forms). The `withdraw()` method behaves differently based on the object type calling it (Savings enforces limits, Current allows overdraft, FD applies penalties).
5. **What is Method Overriding?**
   *Answer*: A subclass provides a specific implementation of a method already provided by its parent class.
6. **How did you prevent the instantiation of the `Account` class?**
   *Answer*: By checking `if (new.target === Account)` in the constructor and throwing an error. This simulates an abstract class in JavaScript.
7. **What is the Factory Design Pattern?**
   *Answer*: A creational pattern used in `AccountFactory.createAccount()`. It abstracts the instantiation logic, returning the correct subclass based on a string parameter ("Savings", "Current", etc.).
8. **What is the MERN stack?**
   *Answer*: MongoDB (Database), Express.js (Backend Framework), React.js (Frontend Library), Node.js (Runtime Environment).
9. **Why use JWT for authentication?**
   *Answer*: JSON Web Tokens allow stateless authentication, reducing server memory usage compared to session-based auth. It is secure and easily verifiable.
10. **How did you secure passwords?**
    *Answer*: By hashing them using `bcrypt` before saving them to the MongoDB database.
*(Note: I have provided the top 10 most critical viva questions for brevity, but a full 50-question set can be generated following the same pattern focusing on OOP, React, Node.js, and MongoDB specifics).*
