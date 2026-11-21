<div align="center">

# CyberShield — Online Scam & Phishing Awareness Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38Bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

*An enterprise-grade security intelligence and threat detection platform engineered to protect users from malicious phishing links, social engineering scams, and code vulnerabilities.*

</div>

---

## 👥 Engineering Team

| Role | Developer | Focus & Responsibilities |
| :--- | :--- | :--- |
| **Frontend Development** | **Hafsa (Hafsa Dev)** | UI/UX architecture, React SPA component design, responsive layouts, and bilingual Urdu/English integration. |
| **Backend Development** | **Muhammad Ahmad Shahid** | Express & Serverless API architecture, deterministic cybersecurity heuristic engine, and threat pattern detection. |

---

## 🛡️ Core Capabilities & Modules

1. **Website & URL Risk Analyzer**
   - Performs deterministic heuristic domain checks (HTTPS validation, raw IP detection, Punycode `xn--` homograph checks, URL shorteners, and excessive subdomains).
   - Inspects brand impersonation / typosquatting patterns across global and regional banking/wallet brands.
   - Computes an instant risk score (0–100) with actionable security recommendations.

2. **Scam Message Threat Analyzer**
   - Evaluates suspicious SMS, WhatsApp, and email messages for social engineering indicators.
   - Detects psychological manipulation tactics (urgency, financial greed hooks, credential harvesting, and authority impersonation).

3. **Cryptographic Hash Inspector**
   - Analyzes MD5, SHA-1, SHA-256, and SHA-512 hashes.
   - Identifies algorithm formats and string length integrity.

4. **Security Code Auditor**
   - Scans source code snippets for security vulnerabilities (DOM XSS, `eval()`, SQL injection patterns, hardcoded credentials, and plaintext HTTP endpoints).
   - Generates security scores and remediation best practices.

5. **Phishing Training & Quiz**
   - Interactive scenario-based training modules in English and Urdu to educate users on spotting online scams.

6. **Bilingual Safety Guidelines**
   - Complete security best practice guides available instantly in both **English and Urdu (اردو)**.

---

## ⚙️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Vite
- **Backend**: Node.js, Express (local dev) & Vercel Serverless Functions (`/api/*`)
- **Security Engine**: Deterministic Cybersecurity Heuristic & Pattern Analysis Core (`/lib/securityEngine.ts`)

---

## 🚀 Local Development & Vercel Deployment

### Local Development
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Ahmad-Al-Hash/Cyber-Sheild.git
   cd Cyber-Sheild
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run Development Server**:
   ```bash
   npm run dev
   ```
4. **Build for Production**:
   ```bash
   npm run build
   ```

### Deploy to Vercel
This project is pre-configured for zero-config **Vercel** deployment via `vercel.json` and serverless endpoints in `/api/`:
1. Push your repository to GitHub.
2. Import the repository in the **Vercel Dashboard**.
3. Framework Preset is automatically detected as **Vite** (`Build Command: npm run build`, `Output Directory: dist`).
4. Click **Deploy** — no external API keys or environment variables required.

---

## 📄 License

This project is open-source under the MIT License.
