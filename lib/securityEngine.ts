export interface UrlAnalysisResult {
  riskScore: number;
  status: 'Safe' | 'Suspicious' | 'Dangerous';
  sslInfo: string;
  domainAge: string;
  typosquattingCheck: string;
  redFlags: string[];
  recommendations: string[];
  summaryReport: string;
}

export interface MessageAnalysisResult {
  threatLevel: 'Low' | 'Medium' | 'High';
  confidence: string;
  tactics: string[];
  summary: string;
  redFlags: string[];
  recommendations: string[];
}

export interface CodeAuditVulnerability {
  severity: 'Low' | 'Medium' | 'High';
  title: string;
  description: string;
}

export interface CodeAuditResult {
  securityScore: number;
  vulnerabilities: CodeAuditVulnerability[];
  safePractices: string[];
  recommendations: string[];
}

const KNOWN_BRANDS = [
  'google',
  'apple',
  'microsoft',
  'paypal',
  'netflix',
  'amazon',
  'facebook',
  'instagram',
  'whatsapp',
  'jazzcash',
  'easypaisa',
  'hbl',
  'meezan',
  'ubl',
  'alfalah',
  'sadapay',
  'nayapay',
  'binance',
];

const OFFICIAL_DOMAINS: Record<string, string[]> = {
  google: ['google.com', 'accounts.google.com', 'mail.google.com'],
  apple: ['apple.com', 'icloud.com', 'support.apple.com'],
  microsoft: ['microsoft.com', 'live.com', 'outlook.com', 'office.com'],
  paypal: ['paypal.com'],
  netflix: ['netflix.com', 'help.netflix.com'],
  amazon: ['amazon.com', 'amazon.co.uk'],
  facebook: ['facebook.com', 'fb.com'],
  instagram: ['instagram.com'],
  whatsapp: ['whatsapp.com', 'web.whatsapp.com'],
  jazzcash: ['jazzcash.com.pk'],
  easypaisa: ['easypaisa.com.pk'],
  hbl: ['hbl.com'],
  meezan: ['meezanbank.com'],
  ubl: ['ubldigital.com'],
  alfalah: ['bankalfalah.com'],
  sadapay: ['sadapay.pk'],
  nayapay: ['nayapay.com'],
  binance: ['binance.com'],
};

const SUSPICIOUS_TLDS = [
  '.xyz',
  '.top',
  '.tk',
  '.ml',
  '.ga',
  '.cf',
  '.gq',
  '.cc',
  '.buzz',
  '.loan',
  '.click',
  '.link',
  '.work',
  '.zip',
  '.mov',
];

const URL_SHORTENERS = [
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'is.gd',
  'cutt.ly',
  'rb.gy',
  'ow.ly',
  'shorturl.at',
];

export function analyzeUrl(rawUrl: string): UrlAnalysisResult {
  const trimmed = rawUrl.trim();
  const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed: URL | null = null;
  try {
    parsed = new URL(normalized);
  } catch {
    parsed = null;
  }

  let riskScore = 100;
  const redFlags: string[] = [];
  const lowerUrl = trimmed.toLowerCase();
  const hostname = parsed ? parsed.hostname.toLowerCase() : lowerUrl.split('/')[0];

  if (!lowerUrl.startsWith('https://')) {
    if (lowerUrl.startsWith('http://')) {
      riskScore -= 25;
      redFlags.push('Insecure protocol: URL uses unencrypted HTTP instead of HTTPS.');
    } else if (!parsed) {
      riskScore -= 30;
      redFlags.push('Malformed URL syntax detected.');
    } else {
      riskScore -= 10;
      redFlags.push('Protocol not explicitly specified; always confirm HTTPS in browser bar.');
    }
  }

  if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(hostname)) {
    riskScore -= 45;
    redFlags.push('IP address host: URL uses raw IP address instead of a registered domain name.');
  }

  if (lowerUrl.includes('@')) {
    riskScore -= 35;
    redFlags.push('Embedded "@" credential/host obfuscation symbol detected in URL.');
  }

  if (hostname.includes('xn--')) {
    riskScore -= 35;
    redFlags.push('Punycode (xn--) domain detected, commonly used in IDN homograph lookalike attacks.');
  }

  if (URL_SHORTENERS.some((s) => hostname === s || hostname.endsWith(`.${s}`))) {
    riskScore -= 25;
    redFlags.push('URL shortener detected; destination domain is masked.');
  }

  const deceptiveKeywords = [
    '-login',
    '-verify',
    '-update',
    '-secure',
    'banking',
    'support',
    'account',
    'auth',
    'free',
    'prize',
    'win',
    'claim',
    'wallet',
    'crypto',
    'kyc',
    'suspend',
    'confirm',
  ];
  const foundKeywords = deceptiveKeywords.filter((kw) => lowerUrl.includes(kw));
  if (foundKeywords.length > 0) {
    riskScore -= Math.min(45, foundKeywords.length * 15);
    redFlags.push(`Deceptive pattern detected: Contains phishing keywords (${foundKeywords.join(', ')}).`);
  }

  if (SUSPICIOUS_TLDS.some((tld) => hostname.endsWith(tld))) {
    riskScore -= 25;
    redFlags.push('High-risk top-level domain frequently associated with fraudulent campaigns.');
  }

  const dotCount = (hostname.match(/\./g) || []).length;
  if (dotCount > 3) {
    riskScore -= 15;
    redFlags.push('Excessive subdomain depth, indicating potential domain masking or spoofing.');
  }

  let brandImpersonation = false;
  for (const brand of KNOWN_BRANDS) {
    if (hostname.includes(brand)) {
      const officialList = OFFICIAL_DOMAINS[brand] || [];
      const isOfficial = officialList.some(
        (d) => hostname === d || hostname.endsWith(`.${d}`)
      );
      if (!isOfficial) {
        brandImpersonation = true;
        riskScore -= 40;
        redFlags.push(
          `Brand impersonation risk: Domain references "${brand}" outside official domains (${officialList.join(', ')}).`
        );
        break;
      }
    }
  }

  if (trimmed.length > 90) {
    riskScore -= 10;
    redFlags.push('Unusually long URL length often used to hide malicious query parameters.');
  }

  riskScore = Math.max(0, Math.min(100, riskScore));
  const status: 'Safe' | 'Suspicious' | 'Dangerous' =
    riskScore >= 75 ? 'Safe' : riskScore >= 40 ? 'Suspicious' : 'Dangerous';

  const sslInfo = lowerUrl.startsWith('http://')
    ? 'Missing or Insecure SSL Certificate (HTTP)'
    : 'Valid TLS/SSL Protocol Indicator (HTTPS)';

  const domainAge =
    riskScore < 50 ? 'High-risk pattern (typical of newly spun-up domains)' : 'Standard domain structure';

  const typosquattingCheck = brandImpersonation
    ? 'Brand impersonation / lookalike domain detected'
    : foundKeywords.length > 0
    ? 'Suspicious keyword pattern in host or path'
    : 'No obvious brand typosquatting detected';

  const recommendations =
    status === 'Safe'
      ? [
          'Domain structure conforms to standard security heuristics.',
          'Always verify official organization bookmarks before submitting personal credentials.',
        ]
      : [
          'Do not click this link or enter personal credentials.',
          'Report this URL to your IT security department or FIA Cyber Crime Wing (NR3C).',
          'Verify the official organization website through an independent search engine.',
        ];

  const summaryReport = `Deterministic heuristic scan completed. Evaluated against cybersecurity rule signatures with a calculated risk score of ${riskScore}/100.`;

  return {
    riskScore,
    status,
    sslInfo,
    domainAge,
    typosquattingCheck,
    redFlags:
      redFlags.length > 0
        ? redFlags
        : ['No severe threat indicators found by heuristic rules.'],
    recommendations,
    summaryReport,
  };
}

export function analyzeMessage(message: string): MessageAnalysisResult {
  const lowerMsg = message.toLowerCase();
  const tactics: string[] = [];
  const redFlags: string[] = [];
  let threatScore = 0;

  if (
    /(urgent|immediately|act now|hurry|expire|suspended|blocked|within 24 hours|band ho|foran|aakhri moqa)/.test(
      lowerMsg
    )
  ) {
    threatScore += 35;
    tactics.push('Urgency & Time Pressure');
    redFlags.push('Creates artificial time pressure to force hasty actions.');
  }

  if (
    /(win|won|prize|lottery|bonus|pkr|million|lakh|crore|cash|reward|inaam|benazir|ehsaas)/.test(
      lowerMsg
    )
  ) {
    threatScore += 30;
    tactics.push('Financial Greed Hook');
    redFlags.push('Promises unsolicited monetary rewards, aid grants, or lottery winnings.');
  }

  if (
    /(verify|pin|password|otp|cnic|account number|jazzcash|easypaisa|bank|kyc|mpin|cvv)/.test(
      lowerMsg
    )
  ) {
    threatScore += 40;
    tactics.push('Credential Harvesting');
    redFlags.push('Requests sensitive financial, OTP, PIN, or personal identification details.');
  }

  if (/(call now|click here|link below|sms to|http:\/\/|https:\/\/|\.xyz|\.tk)/.test(lowerMsg)) {
    threatScore += 20;
    tactics.push('Call-to-Action Link / Phone Trap');
    redFlags.push('Directs victim to external links or unverified contact channels.');
  }

  if (/(police|fia|fbr|nadra|state bank|sbp|court|legal action|arrest)/.test(lowerMsg)) {
    threatScore += 30;
    tactics.push('Authority Impersonation');
    redFlags.push('Impersonates government, banking, or law enforcement authorities.');
  }

  const threatLevel: 'Low' | 'Medium' | 'High' =
    threatScore >= 60 ? 'High' : threatScore >= 30 ? 'Medium' : 'Low';
  const confidence = `${Math.min(99, 70 + Math.round(threatScore * 0.25))}%`;

  const summary =
    threatLevel === 'High'
      ? 'High-risk social engineering scam message designed to deceive victims into surrendering credentials or funds.'
      : threatLevel === 'Medium'
      ? 'Suspicious message exhibiting moderate deception indicators and pressure tactics.'
      : 'Message appears normal with low risk indicators.';

  const recommendations = [
    'Never share your PIN, password, CVV, or OTP via SMS, calls, or messaging apps.',
    'Block the sender number and do not click any embedded links.',
    'Contact your financial institution directly through their official published helpline.',
  ];

  return {
    threatLevel,
    confidence,
    tactics: tactics.length > 0 ? tactics : ['General Communication'],
    summary,
    redFlags:
      redFlags.length > 0
        ? redFlags
        : ['No prominent social engineering red flags identified.'],
    recommendations,
  };
}

export function auditCode(code: string): CodeAuditResult {
  const vulnerabilities: CodeAuditVulnerability[] = [];
  const safePractices: string[] = [];
  let securityScore = 100;

  if (
    code.includes('innerHTML') ||
    code.includes('outerHTML') ||
    code.includes('document.write') ||
    code.includes('dangerouslySetInnerHTML')
  ) {
    securityScore -= 30;
    vulnerabilities.push({
      severity: 'High',
      title: 'Cross-Site Scripting (XSS) Vulnerability',
      description:
        'Direct DOM/HTML injection via innerHTML, document.write, or dangerouslySetInnerHTML allows malicious script execution.',
    });
  }

  if (/\beval\s*\(|new\s+Function\s*\(/.test(code)) {
    securityScore -= 40;
    vulnerabilities.push({
      severity: 'High',
      title: 'Dangerous Dynamic Code Execution (eval / Function)',
      description:
        'Using eval() or new Function() exposes the application to arbitrary code execution attacks.',
    });
  }

  if (/(SELECT|INSERT|UPDATE|DELETE)\s+.*(\+\s*[a-zA-Z_$]|\$\{)/i.test(code)) {
    securityScore -= 35;
    vulnerabilities.push({
      severity: 'High',
      title: 'Potential SQL Injection Risk',
      description:
        'String concatenation or template interpolation in SQL queries can allow attackers to manipulate database commands.',
    });
  }

  if (/(password|secret|api_?key|token|private_?key)\s*[:=]\s*['"][^'"]{4,}['"]/i.test(code)) {
    securityScore -= 25;
    vulnerabilities.push({
      severity: 'Medium',
      title: 'Hardcoded Credential Risk',
      description:
        'Credentials, tokens, or secret keys appear hardcoded directly within source code.',
    });
  }

  if (/http:\/\/(?!localhost|127\.0\.0\.1)/i.test(code)) {
    securityScore -= 15;
    vulnerabilities.push({
      severity: 'Medium',
      title: 'Insecure Plaintext HTTP Request',
      description:
        'Using unencrypted http:// endpoints exposes sensitive payloads to man-in-the-middle interception.',
    });
  }

  if (code.includes('textContent') || code.includes('innerText')) {
    safePractices.push('Uses safe DOM text assignment (textContent / innerText)');
  }
  if (code.includes('===') || code.includes('!==')) {
    safePractices.push('Uses strict equality comparisons');
  }
  if (safePractices.length === 0) {
    safePractices.push('Strict input sanitization checks recommended');
    safePractices.push('Use parameterized queries and safe DOM APIs');
  }

  securityScore = Math.max(10, securityScore);

  const recommendations = [
    'Implement Content Security Policy (CSP) headers',
    'Escape and validate all user-supplied data prior to rendering or database execution',
    'Store all credentials and tokens in environment variables, never in source files',
  ];

  return {
    securityScore,
    vulnerabilities:
      vulnerabilities.length > 0
        ? vulnerabilities
        : [
            {
              severity: 'Low',
              title: 'No major vulnerability patterns detected',
              description: 'Code structure adheres to basic safety guidelines.',
            },
          ],
    safePractices,
    recommendations,
  };
}
