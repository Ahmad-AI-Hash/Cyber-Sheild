interface ReqLike {
  method?: string;
}

interface ResLike {
  status: (code: number) => ResLike;
  json: (data: unknown) => void;
}

export default function handler(_req: ReqLike, res: ResLike) {
  return res.status(200).json({
    status: 'ok',
    service: 'CyberShield Security Engine',
    timestamp: new Date().toISOString(),
  });
}
