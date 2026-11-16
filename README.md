<div align="center">

# CyberShield — Online Scam & Phishing Awareness Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38Bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

*An enterprise-grade security intelligence and threat detection platform engineered to protect users from malicious phishing links, social engineering scams, and code vulnerabilities.*

</div>

---

## 👥 Engineering Team

| Role | Developer | Focus & Responsibilities |
| :--- | :--- | :--- |
| **Frontend Development** | **Hafsa (Hafsa Dev)** | UI/UX architecture, React SPA component design, responsive layouts, and bilingual Urdu/English integration. |
| **Backend Development** | **Muhammad Ahmad Shahid** | Express server architecture, REST API endpoints, security heuristic engine, and threat analysis core. |

---

## 🛡️ Core Capabilities & Modules

1. **Website & URL Risk Analyzer**
   - Performs heuristic domain checks (HTTPS validation, IP address detection, excessive subdomains).
   - Inspects SSL/TLS certificate signals and typosquatting/spoofing patterns.
   - Computes an instant risk score (0–100) with actionable recommendations.

2. **Scam Message Threat Analyzer**
   - Evaluates suspicious SMS, WhatsApp, and email messages for social engineering indicators.
   - Detects psychological manipulation tactics (urgency, fear induction, financial impersonation).

3. **Cryptographic Hash Inspector**
   - Analyzes MD5, SHA-1, SHA-256, and SHA-512 hashes.
   - Identifies algorithm formats and signature integrity.

4. **Security Code Auditor**
   - Scans source code snippets for security vulnerabilities (e.g., DOM XSS, unsafe inputs).
   - Generates security scores and secure coding best practices.

5. **Phishing Training & Quiz**
   - Interactive scenario-based training modules to educate users on spotting online scams.

6. **Bilingual Safety Guidelines**
   - Complete security best practice guides available instantly in both **English and Urdu (اردو)**.

7. **Activity Log & Scan History**
   - Persistent tracking of recent website and message security checks.

---

## ⚙️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Node.js, Express, TypeScript, Neural Threat Evaluation Core
- **Storage**: LocalStorage for session audit history

---

## 🚀 Installation & Local Development

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Ahmad-Al-Hash/Cyber-Sheild.git
   cd Cyber-Sheild
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   PORT=3000
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📄 License

This project is open-source under the MIT License.
