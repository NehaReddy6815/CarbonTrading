# 🌱 CryptoLedger: Carbon Credit Trading with SHA-256 & Stellar

## 📌 Overview

This project is a full-stack blockchain-based carbon trading platform that enables users to create, verify, and track carbon credit transactions.

It integrates a **React frontend**, **Node.js backend**, and the **Stellar blockchain** to ensure transparency, immutability, and secure transaction recording.

---

## 🚀 Features

### 🔹 Create Trade

* Users can input buyer, seller, and credit details
* Generates a **SHA-256 hash** for the transaction
* Stores transaction on **Stellar blockchain**
* Displays:

  * Wallet address
  * Hash
  * Transaction ID

---

### 🔹 Verify Trade

* Users can enter a transaction hash
* Verifies existence on blockchain
* Displays:

  * ✅ Valid
  * ❌ Not Found

---

### 🔹 Trade History

* Displays all transactions
* Shows:

  * Buyer
  * Seller
  * Credits
* Uses in-memory storage (can be extended to MongoDB)

---

## 🛠️ Tech Stack

### Frontend

* React (Create React App)
* Axios
* Freighter Wallet API

### Backend

* Node.js
* Express.js
* Crypto (SHA-256 hashing)

### Blockchain

* Stellar Network

---

## 🔗 Wallet Integration

* Uses **Freighter Wallet**
* Connects to user wallet
* Retrieves public key
* Used for transaction interaction

---

## 📂 Project Structure

carbon_trading/
│
├── frontend/        # React UI
├── backend/         # Express server + Stellar logic
└── README.md

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/vedashreeraut/CarbonTrading.git
cd CarbonTrading
```

---

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

Server runs on:

```
http://localhost:5001
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

App runs on:

```
http://localhost:3000
```

---

## ⚠️ Notes

* MongoDB is currently disabled and replaced with **in-memory storage** for demo purposes
* Data resets when backend restarts
* Can be extended to persistent storage easily

---

## 🎯 Future Improvements

* MongoDB integration for persistent storage
* Smart contract enhancements
* Better UI/UX animations
* Authentication system

---

## 📌 Conclusion

This project demonstrates how blockchain can be used to build transparent and secure systems for carbon credit trading, combining modern frontend development with decentralized technology.
