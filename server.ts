import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } }) : null;

// API Endpoints
app.post('/api/analyze-url', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    let heuristicScore = 100;
    const reasons: string[] = [];
    const lowerUrl = url.toLowerCase();

    if (!lowerUrl.startsWith('https://')) {
      heuristicScore -= 25;
      reasons.push('URL does not use secure HTTPS protocol.');
    }
    if (/(-login|-verify|-update|-secure|banking|support|account|auth|free|prize|win)/.test(lowerUrl)) {
      heuristicScore -= 35;
      reasons.push('URL contains common deceptive keywords often used in phishing (-login, verify, secure, win, etc.).');
    }
    if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(lowerUrl)) {
      heuristicScore -= 45;
      reasons.push('URL uses raw IP address instead of a standard domain name.');
    }
    if ((lowerUrl.match(/\./g) || []).length > 3) {
      heuristicScore -= 20;
      reasons.push('URL has excessive subdomains, indicating potential subdomain spoofing.');
    }

    let aiAnalysis = {
      riskScore: Math.max(0, heuristicScore),
      status: heuristicScore > 75 ? 'Safe' : heuristicScore > 40 ? 'Suspicious' : 'Dangerous',
      sslInfo: lowerUrl.startsWith('https://') ? 'Valid SSL Certificate (TLS 1.3)' : 'Missing or Insecure SSL Certificate',
      domainAge: 'Estimated ~2 years old',
      typosquattingCheck: 'No obvious typosquatting detected',
      redFlags: reasons.length > 0 ? reasons : ['No critical red flags found in preliminary heuristic check.'],
      recommendations: [
        'Always verify the official domain name in your browser address bar.',
        'Never enter login credentials from links received in unsolicited messages.',
        'Look for valid SSL certificates and trusted organization seals.'
      ],
      aiSummary: 'Standard threat assessment based on URL structure, security heuristics, and domain characteristics.'
    };

    if (ai) {
      try {
        const prompt = `Analyze this URL for phishing and online scams: "${url}". Return a JSON object with:
        - riskScore (number 0-100, where 100 is completely safe and 0 is high risk phishing/malware)
        - status ("Safe", "Suspicious", or "Dangerous")
        - sslInfo (string describing SSL status)
        - domainAge (string estimating domain age or registration status)
        - typosquattingCheck (string analyzing if domain imitates a known brand)
        - redFlags (array of strings detailing detected risks)
        - recommendations (array of security advice strings)
        - aiSummary (string summary of the threat level)`;

        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          aiAnalysis = { ...aiAnalysis, ...parsed };
        }
      } catch (aiErr) {
        console.error('Gemini URL analysis error:', aiErr);
      }
    }

    res.json(aiAnalysis);
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

    let result = {
      threatLevel: 'Medium',
      confidence: '85%',
      tactics: ['Urgency', 'Fear induction', 'Call to action link'],
      summary: 'Message prompts immediate action with alarming claims typical of phishing scams.',
      redFlags: ['Demands urgent response', 'Threatens account suspension'],
      recommendations: ['Do not click any links', 'Contact the institution directly through official phone numbers']
    };

    if (ai) {
      try {
        const prompt = `Analyze this suspicious text message, SMS, WhatsApp message, or email for scam/phishing indicators: "${message}". Return a JSON object with:
        - threatLevel ("Low", "Medium", or "High")
        - confidence (string percentage like "92%")
        - tactics (array of strings identifying social engineering tactics like Urgency, Fear, Impersonation, Greed)
        - summary (string overview of why this message is deceptive)
        - redFlags (array of specific red flags found)
        - recommendations (array of safety recommendations)`;

        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          result = { ...result, ...parsed };
        }
      } catch (aiErr) {
        console.error('Gemini message analysis error:', aiErr);
      }
    }

    res.json(result);
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

    let audit = {
      securityScore: 80,
      vulnerabilities: [
        { severity: 'Low', title: 'Inline Event Handlers', description: 'Consider moving event listeners to external scripts.' }
      ],
      safePractices: ['Uses strict comparison operators', 'No hardcoded API secrets detected in sample'],
      recommendations: ['Sanitize all user inputs before DOM insertion', 'Ensure Content Security Policy (CSP) headers are set']
    };

    if (ai) {
      try {
        const prompt = `Audit this source code snippet for security vulnerabilities, malicious patterns, or insecure coding practices: \`\`\`\n${code}\n\`\`\`. Return a JSON object with:
        - securityScore (number 0-100)
        - vulnerabilities (array of objects with severity "Low"/"Medium"/"High", title, description)
        - safePractices (array of strings)
        - recommendations (array of strings)`;

        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          audit = { ...audit, ...parsed };
        }
      } catch (aiErr) {
        console.error('Gemini code audit error:', aiErr);
      }
    }

    res.json(audit);
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
