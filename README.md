# 🛰️ Enterprise Decentralized Secret Operations Center (DSOC)

Welcome to the **Decentralized Secret Operations Center (DSOC)**! This is a production-grade, full-stack microservices sandbox demonstrating an advanced, distributed architectural pattern. It decouples user session management from protected payload processing by deploying **two completely isolated backend nodes** operating on separate network gates, linked seamlessly via cryptographic token signature audits.

This project mimics real-world corporate engineering clusters (such as those used by Netflix or Amazon), where storage nodes handle payload data securely without ever needing direct access to a core user credentials database.

---

## 🗺️ Distributed Microservices Network Map

```text
secure-dsoc-sandbox/             # 🚀 Master Microservices Distributed Parent Root House
├── docker-compose.yml           # Master Multi-Container Orchestration Assembly Sheet
├── .gitignore                   # Global Safety Exclusion Shield
│
├── auth-audit-service/          # 🔐 MICROSERVICE A: Independent Gateway (Port 3040)
│   ├── index.js                 # Service Ignition Engine & Express Configurations
│   ├── package.json             # Service Package Dependency Sheet
│   └── src/
│       └── routes/
│           └── auth.js          # Registration & Audited Login Route Controller
│
├── vault-data-service/          # 🔒 MICROSERVICE B: Guarded Storage Room (Port 3060)
│   ├── index.js                 # Vault Server Gateway Ignition point
│   ├── package.json             # Service Package Dependency Sheet
│   └── src/
│       ├── middleware/
│       │   └── verify.js        # Cryptographic Signature Auditor Guard
│       └── routes/
│           └── vault.js         # Guarded Encrypted Data Delivery Desk
│
└── dsoc-portal/                 # 🎨 CENTRAL RE-ACT FRONTEND WORKSPACE (Port 5173)
    ├── index.html               # Main Entry Viewport Window
    └── src/
        ├── App.jsx              # Multi-Service Operation Switchboard Core Controller
        └── main.jsx             # React Mounting Interface Ignition Point
```

---

## 🛡️ Core Architecture & Security Implementations

1. **Decoupled Microservice Isolation:** The Vault Data Node on Port `3060` does not feature any database lookup tables, sign-up forms, or password verification systems. It is entirely isolated from user-management code to shrink the backend attack perimeter.
2. **Cross-Service Signature Verification:** When a user logs in successfully via the Auth-Audit Node on Port `3040`, the server issues a signed **JSON Web Token (JWT)** using a high-entropy secret key. When the frontend requests data from the Vault, the Vault uses a **Signature Guard Middleware** to verify the token natively using the shared cryptographic secret—granting access without querying a database.
3. **Cross-Origin Cookie Orchestration:** The frontend application utilizes the `credentials: 'include'` flag across fetch streams. This explicitly instructs the web browser to capture the secure HTTP-Only cookie token issued by Service A and transport it safely across origin boundaries down to secure routes on Service B.

---

## 🏃‍♂️ Operational Launch Manual

### 🏰 1. Booting the Multi-Service Backend Cluster
Open two separate split terminal frames side-by-side inside your workspace to launch both engines simultaneously:

```bash
# Terminal Tab 1: Ignite the Auth-Audit Microservice Node (Port 3040)
cd auth-audit-service
npm install
node index.js

# Terminal Tab 2: Ignite the Isolated Vault Data Node (Port 3060)
cd ../vault-data-service
npm install
node index.js
```

### 🎨 2. Launching the Central Operations Control Deck Frontend
Open a third terminal pane to spin up your modular Vite compilation web browser user interface:

```bash
cd ../dsoc-portal
npm install
npm run dev
```
Open your browser window at `http://localhost:5173/` to log inside the active mesh and unlock the secure cloud data streams!

---

## 🤖 Continuous Integration Test Matrix Checkboxes
The Auth service core includes a robust Jest testing harness ensuring structural boundary rules:
*   `✓ should catch invalid credential sets, deny entry, and log a failed event parameters payload`
