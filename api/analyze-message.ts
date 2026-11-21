import { analyzeMessage } from '../lib/securityEngine';

interface ReqLike {
  method?: string;
  body?: unknown;
}

interface ResLike {
  status: (code: number) => ResLike;
  json: (data: unknown) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
}

export default function handler(req: ReqLike, res: ResLike) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body =
      typeof req.body === 'string' ? JSON.parse(req.body) : (req.body as Record<string, unknown> | undefined);
    const message = typeof body?.message === 'string' ? body.message : '';

    if (!message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = analyzeMessage(message);
    return res.status(200).json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}
