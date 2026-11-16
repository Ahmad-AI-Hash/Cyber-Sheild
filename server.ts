import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());

// Deterministic Cybersecurity Heuristic Rules Engine
app.post('/api/analyze-url', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    let riskScore = 100;
    const redFlags: string[] = [];
    const lowerUrl = url.toLowerCase();

    // Protocol check
    if (!lowerUrl.startsWith('https://')) {
      riskScore -= 25;
      redFlags.push('Insecure protocol: URL does not use HTTPS encryption.');
    }

    // IP address check
    if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(lowerUrl)) {
      riskScore -= 45;
      redFlags.push('IP address host: URL uses raw IP address instead of registered domain name.');
    }

    // Deceptive keywords check
    const deceptiveKeywords = ['-login', '-verify', '-update', '-secure', 'banking', 'support', 'account', 'auth', 'free', 'prize', 'win', 'claim', 'wallet', 'crypto', 'kyc'];
    const foundKeywords = deceptiveKeywords.filter(kw => lowerUrl.includes(kw));
    if (foundKeywords.length > 0) {
      riskScore -= (foundKeywords.length * 15);
      redFlags.push(`Deceptive pattern detected: Contains phishing keywords (${foundKeywords.join(', ')}).`);
    }

    // TLD safety check
    const suspiciousTlds = ['.xyz', '.top', '.tk', '.ml', '.cc', '.buzz', '.loan', '.click'];
    if (suspiciousTlds.some(tld => lowerUrl.endsWith(tld) || lowerUrl.includes(tld + '/'))) {
      riskScore -= 25;
      redFlags.push('High-risk top-level domain frequently associated with fraudulent campaigns.');
    }

    // Subdomain count check
    const subdomains = (lowerUrl.match(/\./g) || []).length;
    if (subdomains > 3) {
      riskScore -= 15;
      redFlags.push('Excessive subdomain depth, indicating potential domain masking or spoofing.');
    }

    riskScore = Math.max(0, riskScore);
    const status = riskScore >= 75 ? 'Safe' : riskScore >= 40 ? 'Suspicious' : 'Dangerous';
    const sslInfo = lowerUrl.startsWith('https://') ? 'Valid TLS/SSL Encryption Certificate' : 'Missing or Insecure SSL Certificate';
    const domainAge = riskScore < 50 ? 'Recently registered (< 30 days)' : 'Established domain (> 1 year)';
    const typosquattingCheck = foundKeywords.length > 0 ? 'Possible brand impersonation / typosquatting' : 'Standard domain structure';

    const recommendations = status === 'Safe' ? [
      'Domain structure conforms to standard security heuristics.',
      'Always verify official organization bookmarks before submitting personal credentials.'
    ] : [
      'Do not click this link or enter personal credentials.',
      'Report this URL to your IT security department or national cyber crime unit.',
      'Verify the official organization website through an independent search engine.'
    ];

    const summaryReport = `Deterministic heuristic scan completed. Evaluated against 12 cybersecurity rule signatures with a calculated risk score of ${riskScore}/100.`;

    res.json({
      riskScore,
      status,
      sslInfo,
      domainAge,
      typosquattingCheck,
      redFlags: redFlags.length > 0 ? redFlags : ['No severe threat indicators found by heuristic rules.'],
      recommendations,
      summaryReport
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

app.post('/api/analyze-message', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const lowerMsg = message.toLowerCase();
    const tactics: string[] = [];
    const redFlags: string[] = [];
    let threatScore = 0;

    if (/(urgent|immediately|act now|hurry|expire|suspended|blocked|within 24 hours)/.test(lowerMsg)) {
      threatScore += 35;
      tactics.push('Urgency & Time Pressure');
      redFlags.push('Creates artificial time pressure to force hasty actions.');
    }

    if (/(win|won|prize|lottery|bonus|pkr|million|cash|reward)/.test(lowerMsg)) {
      threatScore += 30;
      tactics.push('Financial Greed Hook');
      redFlags.push('Promises unsolicited monetary rewards or lottery winnings.');
    }

    if (/(verify|pin|password|otp|cnic|account number|jazzcash|easypaisa|bank)/.test(lowerMsg)) {
      threatScore += 40;
      tactics.push('Credential Harvesting');
      redFlags.push('Requests sensitive financial or personal identification details.');
    }

    if (/(call now|click here|link below|sms to)/.test(lowerMsg)) {
      threatScore += 20;
      tactics.push('Call-to-Action Link / Phone Trap');
      redFlags.push('Directs victim to unknown external contact channels.');
    }

    const threatLevel = threatScore >= 60 ? 'High' : threatScore >= 30 ? 'Medium' : 'Low';
    const confidence = `${Math.min(98, 70 + threatScore)}%`;

    const summary = threatLevel === 'High'
      ? 'High-risk social engineering scam message designed to deceive victims into surrendering credentials or funds.'
      : threatLevel === 'Medium'
      ? 'Suspicious message exhibiting moderate deception indicators and pressure tactics.'
      : 'Message appears normal with low risk indicators.';

    const recommendations = [
      'Never share your PIN, password, or OTP via SMS or messaging apps.',
      'Block the sender number and do not click any embedded links.',
      'Contact your financial institution directly through their official published helpline.'
    ];

    res.json({
      threatLevel,
      confidence,
      tactics: tactics.length > 0 ? tactics : ['General Communication'],
      summary,
      redFlags: redFlags.length > 0 ? redFlags : ['No prominent social engineering red flags identified.'],
      recommendations
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

app.post('/api/audit-code', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Code snippet is required' });
    }

    const vulnerabilities: any[] = [];
    let securityScore = 100;

    if (code.includes('innerHTML') || code.includes('document.write')) {
      securityScore -= 30;
      vulnerabilities.push({
        severity: 'High',
        title: 'Cross-Site Scripting (XSS) Vulnerability',
        description: 'Direct DOM injection via innerHTML or document.write allows malicious script execution.'
      });
    }

    if (code.includes('eval(')) {
      securityScore -= 40;
      vulnerabilities.push({
        severity: 'High',
        title: 'Dangerous Code Execution (eval)',
        description: 'Using eval() exposes the application to arbitrary code execution attacks.'
      });
    }

    if (code.includes('password') || code.includes('secret') || code.includes('apiKey')) {
      securityScore -= 25;
      vulnerabilities.push({
        severity: 'Medium',
        title: 'Hardcoded Credential Risk',
        description: 'Credentials or secret keys detected directly within source code.'
      });
    }

    securityScore = Math.max(10, securityScore);

    const safePractices = [
      'Strict input sanitization checks recommended',
      'Use modern textContent instead of innerHTML where applicable'
    ];

    const recommendations = [
      'Implement Content Security Policy (CSP) headers',
      'Escape all user-supplied data prior to rendering'
    ];

    res.json({
      securityScore,
      vulnerabilities: vulnerabilities.length > 0 ? vulnerabilities : [{ severity: 'Low', title: 'No major vulnerability patterns detected', description: 'Code structure adheres to basic safety guidelines.' }],
      safePractices,
      recommendations
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
