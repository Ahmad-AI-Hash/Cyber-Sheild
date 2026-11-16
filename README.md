# CyberShield — Online Scam & Phishing Awareness Platform

CyberShield is a state-of-the-art web application designed to help users identify potentially suspicious URLs, analyze scam messages using AI, inspect cryptographic hashes, audit source code for security vulnerabilities, and learn online safety practices in both English and Urdu (اردو).

## 🚀 Key Features

- **URL Risk Analysis**: Instant heuristic and AI-powered inspection of domains, SSL certificates, typosquatting, and phishing red flags.
- **Scam Message AI Analyzer**: Evaluates SMS, WhatsApp, and email messages for social engineering tactics (urgency, fear, impersonation).
- **Hash String Analyzer**: Identifies MD5, SHA-1, SHA-256, and SHA-512 hashes.
- **Code Security Auditor**: Scans code snippets for security vulnerabilities.
- **Phishing Training Quiz**: Interactive scenarios to test threat-spotting skills.
- **Bilingual Safety Guidelines**: Comprehensive security guides in English and Urdu.
- **Scan History & Persistence**: Tracks recent security checks.

---

## 👥 Development Team

- **Frontend Development**: **Hafsa (Hafsa Dev)** — UI/UX design, React SPA components, responsive layout, and bilingual Urdu/English integration.
- **Backend Development**: **Muhammad Ahmad Shahid** — Express server architecture, REST API endpoints, and Gemini AI integration (`@google/genai`).

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Node.js, Express, TypeScript, `@google/genai` (Gemini 4 Hydrogen model)
- **Deployment**: AI Studio Container Environment

---

## ⚙️ Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your Gemini API key in `.env`:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
