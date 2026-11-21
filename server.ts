import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { analyzeMessage, analyzeUrl, auditCode } from './lib/securityEngine';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'CyberShield Security Engine',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/analyze-url', (req, res) => {
  try {
    const url = typeof req.body?.url === 'string' ? req.body.url : '';
    if (!url.trim()) {
      return res.status(400).json({ error: 'URL is required' });
    }
    return res.json(analyzeUrl(url));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
});

app.post('/api/analyze-message', (req, res) => {
  try {
    const message = typeof req.body?.message === 'string' ? req.body.message : '';
    if (!message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }
    return res.json(analyzeMessage(message));
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    return res.status(500).json({ error: errorMessage });
  }
});

app.post('/api/audit-code', (req, res) => {
  try {
    const code = typeof req.body?.code === 'string' ? req.body.code : '';
    if (!code.trim()) {
      return res.status(400).json({ error: 'Code snippet is required' });
    }
    return res.json(auditCode(code));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
});

async function startServer() {
  const rootDir = import.meta.dirname ?? process.cwd();

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(rootDir, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
