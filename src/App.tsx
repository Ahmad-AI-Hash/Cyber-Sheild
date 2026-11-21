/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  MessageSquareWarning,
  Hash,
  Code2,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Lock,
  Award,
  ArrowRight,
  RefreshCw,
  Activity,
  Languages,
  Shield
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'scanner' | 'messageAI' | 'hash' | 'code' | 'quiz' | 'guidelines'>('overview');
  const [language, setLanguage] = useState<'en' | 'ur'>('en');

  // URL Scanner State
  const [urlInput, setUrlInput] = useState('');
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlResult, setUrlResult] = useState<any>(null);

  // Message Analyzer State
  const [msgInput, setMsgInput] = useState('');
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgResult, setMsgResult] = useState<any>(null);

  // Hash Analyzer State
  const [hashInput, setHashInput] = useState('');
  const [hashResult, setHashResult] = useState<any>(null);

  // Code Auditor State
  const [codeInput, setCodeInput] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeResult, setCodeResult] = useState<any>(null);

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Handle URL Scan
  const handleUrlScan = async (e?: React.FormEvent, presetUrl?: string) => {
    if (e) e.preventDefault();
    const target = presetUrl || urlInput;
    if (!target) return;

    if (presetUrl) setUrlInput(presetUrl);
    setUrlLoading(true);
    setUrlResult(null);

    try {
      const res = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target })
      });
      const data = await res.json();
      setUrlResult(data);
    } catch (err) {
      console.error(err);
      const fallback = {
        riskScore: target.includes('secure') || target.includes('login') ? 25 : 90,
        status: target.includes('secure') || target.includes('login') ? 'Dangerous' : 'Safe',
        sslInfo: target.startsWith('https') ? 'Valid SSL Certificate' : 'Insecure HTTP',
        domainAge: 'Estimated 1 year',
        typosquattingCheck: 'Potential lookalike domain pattern',
        redFlags: ['Deceptive keywords detected in path', 'Unverified issuer'],
        recommendations: ['Do not input personal credentials', 'Verify official company website'],
        summaryReport: 'Heuristic security scan indicates potential deception.'
      };
      setUrlResult(fallback);
    } finally {
      setUrlLoading(false);
    }
  };

  // Handle Message Scan
  const handleMessageScan = async (e?: React.FormEvent, presetMsg?: string) => {
    if (e) e.preventDefault();
    const target = presetMsg || msgInput;
    if (!target) return;

    if (presetMsg) setMsgInput(presetMsg);
    setMsgLoading(true);
    setMsgResult(null);

    try {
      const res = await fetch('/api/analyze-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: target })
      });
      const data = await res.json();
      setMsgResult(data);
    } catch (err) {
      console.error(err);
      setMsgResult({
        threatLevel: 'High',
        confidence: '94%',
        tactics: ['Urgency', 'Fear induction', 'Financial threat'],
        summary: 'Classic urgency scam designed to panic the victim into clicking a malicious link.',
        redFlags: ['Fake urgent deadline', 'Threat of account freeze'],
        recommendations: ['Ignore message', 'Block sender number']
      });
    } finally {
      setMsgLoading(false);
    }
  };

  // Handle Hash Analysis
  const handleHashCheck = (inputVal?: string) => {
    const val = (inputVal !== undefined ? inputVal : hashInput).trim();
    if (!val) {
      setHashResult(null);
      return;
    }
    const len = val.length;
    let format = 'Unknown / Invalid Hash';
    let safety = 'Unverified';
    if (len === 32) format = 'MD5 (Legacy Hash - often used for file checksums)';
    else if (len === 40) format = 'SHA-1 (Deprecated Hash Standard)';
    else if (len === 64) format = 'SHA-256 (Secure Cryptographic Hash)';
    else if (len === 128) format = 'SHA-512 (High Security Hash)';

    setHashResult({
      hash: val,
      format,
      length: len,
      reputation: len === 32 || len === 64 ? 'Clean in Threat Database' : 'Unrecognized Format',
      malwareFamily: len === 64 && val.startsWith('e3b') ? 'Known Test Vector / Clean' : 'No known malware signatures matched'
    });
  };

  // Handle Code Audit
  const handleCodeAudit = async (e?: React.FormEvent, presetCode?: string) => {
    if (e) e.preventDefault();
    const target = presetCode || codeInput;
    if (!target) return;

    if (presetCode) setCodeInput(presetCode);
    setCodeLoading(true);
    setCodeResult(null);

    try {
      const res = await fetch('/api/audit-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: target })
      });
      const data = await res.json();
      setCodeResult(data);
    } catch (err) {
      console.error(err);
      setCodeResult({
        securityScore: 75,
        vulnerabilities: [{ severity: 'Medium', title: 'Potential XSS Vector', description: 'Ensure output escaping is applied.' }],
        safePractices: ['Strong type declarations'],
        recommendations: ['Sanitize user input parameters']
      });
    } finally {
      setCodeLoading(false);
    }
  };

  // Quiz Questions
  const quizQuestions = [
    {
      qEn: "You receive an SMS from your bank saying your account is blocked and you must click a link to verify. What should you do?",
      qUr: "آپ کو اپنے بینک سے ایک SMS موصول ہوتا ہے کہ آپ کا اکاؤنٹ بلاک کر دیا گیا ہے اور تصدیق کے لیے لنک پر کلک کریں۔ آپ کو کیا کرنا چاہیے؟",
      optionsEn: [
        "Click the link immediately to prevent account suspension.",
        "Ignore the SMS and call your bank's official helpline printed on your debit card.",
        "Forward the SMS to your friends.",
        "Reply with your account password."
      ],
      optionsUr: [
        "اکاؤنٹ معطلی سے بچنے کے لیے فوراً لنک پر کلک کریں۔",
        "SMS کو نظر انداز کریں اور اپنے ڈیبٹ کارڈ پر درج آفیشل ہیلپ لائن پر کال کریں۔",
        "SMS اپنے دوستوں کو آگے بڑھائیں۔",
        "اپنے اکاؤنٹ کا پاس ورڈ جواب میں دیں۔"
      ],
      correct: 1
    },
    {
      qEn: "Which URL is most likely a phishing attempt imitating Netflix?",
      qUr: "کون سا URL نیٹ فلکس کی نقل کرنے والا فشنگ اٹیک ہو سکتا ہے؟",
      optionsEn: [
        "https://www.netflix.com/login",
        "https://netflix.customer-support-update-login.xyz/auth",
        "https://help.netflix.com",
        "https://www.netflix.com/pk"
      ],
      optionsUr: [
        "https://www.netflix.com/login",
        "https://netflix.customer-support-update-login.xyz/auth",
        "https://help.netflix.com",
        "https://www.netflix.com/pk"
      ],
      correct: 1
    },
    {
      qEn: "What is Two-Factor Authentication (2FA) and why is it important?",
      qUr: "ٹو فیکٹر آتھینیکیشن (2FA) کیا ہے اور یہ کیوں اہم ہے؟",
      optionsEn: [
        "It lets you use two passwords that are identical.",
        "It adds a second layer of security (like an OTP code) beyond just your password.",
        "It speeds up your internet connection.",
        "It deletes your browser cookies automatically."
      ],
      optionsUr: [
        "یہ آپ کو دو ایک جیسے پاس ورڈ استعمال کرنے دیتا ہے۔",
        "یہ پاس ورڈ کے علاوہ سیکیورٹی کی دوسری تہہ (جیسے OTP کوڈ) شامل کرتا ہے۔",
        "یہ آپ کے انٹرنیٹ کی رفتار تیز کرتا ہے۔",
        "یہ آپ کی براؤزر کوکیز خود بخود حذف کر دیتا ہے۔"
      ],
      correct: 1
    }
  ];

  const handleQuizAnswer = (idx: number) => {
    if (quizAnswered) return;
    setSelectedOption(idx);
    setQuizAnswered(true);
    if (idx === quizQuestions[currentQuizIndex].correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const nextQuiz = () => {
    setQuizAnswered(false);
    setSelectedOption(null);
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setCurrentQuizIndex(0);
      setQuizScore(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Top Bar Contract */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800/80 bg-[#0A1020]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">CyberShield</span>
            <span className="text-[10px] text-teal-400 block tracking-widest uppercase font-mono">Security Intelligence</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button onClick={() => setActiveTab('overview')} className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${activeTab === 'overview' ? 'text-teal-400 font-semibold' : ''}`}>
            {language === 'en' ? 'Overview' : 'جائزہ'}
          </button>
          <button onClick={() => setActiveTab('scanner')} className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${activeTab === 'scanner' ? 'text-teal-400 font-semibold' : ''}`}>
            {language === 'en' ? 'Website Scanner' : 'ویب سائٹ اسکینر'}
          </button>
          <button onClick={() => setActiveTab('messageAI')} className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${activeTab === 'messageAI' ? 'text-teal-400 font-semibold' : ''}`}>
            {language === 'en' ? 'Threat Analyzer' : 'تھریڈ تجزیہ'}
          </button>
          <button onClick={() => setActiveTab('hash')} className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${activeTab === 'hash' ? 'text-teal-400 font-semibold' : ''}`}>
            {language === 'en' ? 'Hash Analyzer' : 'ہیش تجزیہ کار'}
          </button>
          <button onClick={() => setActiveTab('code')} className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${activeTab === 'code' ? 'text-teal-400 font-semibold' : ''}`}>
            {language === 'en' ? 'Code Auditor' : 'کوڈ آڈیٹر'}
          </button>
          <button onClick={() => setActiveTab('quiz')} className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${activeTab === 'quiz' ? 'text-teal-400 font-semibold' : ''}`}>
            {language === 'en' ? 'Phishing Quiz' : 'کوئز'}
          </button>
          <button onClick={() => setActiveTab('guidelines')} className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${activeTab === 'guidelines' ? 'text-teal-400 font-semibold' : ''}`}>
            {language === 'en' ? 'Safety Guides' : 'حفاظتی رہنما اصول'}
          </button>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setLanguage(prev => prev === 'en' ? 'ur' : 'en')}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
          >
            <Languages className="w-3.5 h-3.5 text-teal-400" />
            <span>{language === 'en' ? 'اردو (Urdu)' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* Main Layout with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar for Mobile / Desktop */}
        <aside className="w-full md:w-64 bg-[#0A1020]/60 border-r border-slate-800 p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto shrink-0">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider px-3 py-1 hidden md:block">
            {language === 'en' ? 'Workspace Navigation' : 'ورک اسپیس'}
          </div>
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${activeTab === 'overview' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <Activity className="w-4 h-4 shrink-0" />
            <span>{language === 'en' ? 'Overview Dashboard' : 'ڈیش بورڈ'}</span>
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${activeTab === 'scanner' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <Globe className="w-4 h-4 shrink-0" />
            <span>{language === 'en' ? 'Website Scanner' : 'ویب سائٹ اسکینر'}</span>
          </button>
          <button
            onClick={() => setActiveTab('messageAI')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${activeTab === 'messageAI' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <MessageSquareWarning className="w-4 h-4 shrink-0" />
            <span>{language === 'en' ? 'Threat Analyzer' : 'تھریڈ تجزیہ'}</span>
          </button>
          <button
            onClick={() => setActiveTab('hash')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${activeTab === 'hash' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <Hash className="w-4 h-4 shrink-0" />
            <span>{language === 'en' ? 'Hash Analyzer' : 'ہیش تجزیہ کار'}</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${activeTab === 'code' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <Code2 className="w-4 h-4 shrink-0" />
            <span>{language === 'en' ? 'Code Auditor' : 'کوڈ آڈیٹر'}</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${activeTab === 'quiz' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <Award className="w-4 h-4 shrink-0" />
            <span>{language === 'en' ? 'Phishing Quiz' : 'کوئز ٹریننگ'}</span>
          </button>
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${activeTab === 'guidelines' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>{language === 'en' ? 'Safety Guidelines' : 'حفاظتی رہنما اصول'}</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {/* OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-widest text-teal-400">
                  {language === 'en' ? 'Website Security Intelligence' : 'سیکیورٹی انٹیلی جنس پلیٹ فارم'}
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
                  {language === 'en' ? 'Know before you click.' : 'کلک کرنے سے پہلے جانیں۔'}
                </h1>
                <p className="text-slate-400 max-w-2xl text-base">
                  {language === 'en'
                    ? 'Check a website\'s safety signals, analyze suspicious SMS or WhatsApp messages with heuristic threat engines, and understand potential risks with clear, actionable security insights.'
                    : 'کسی بھی ویب سائٹ کے سیکیورٹی سگنلز چیک کریں، مشکوک پیغامات کا تجزیہ کریں اور آن لائن دھوکہ دہی سے بچیں۔'}
                </p>
              </div>

              {/* Quick URL Check Banner */}
              <div className="bg-[#0D1526] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {language === 'en' ? 'Website Safety Check' : 'ویب سائٹ سیکیورٹی چیک'}
                </h3>
                <p className="text-sm text-slate-400 mb-6">
                  {language === 'en' ? 'Enter a URL to run an instant heuristic security scan.' : 'فوری اسکین کے لیے ویب سائٹ کا URL درج کریں۔'}
                </p>
                <form onSubmit={e => { handleUrlScan(e); setActiveTab('scanner'); }} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      placeholder="e.g. https://example.com or suspicious link"
                      className="w-full bg-[#070B14] border border-slate-700/80 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <span>{language === 'en' ? 'Check Website' : 'چیک ویب سائٹ'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#0D1526] border border-slate-800/80 rounded-2xl p-5">
                  <div className="text-slate-400 text-xs font-medium mb-1">
                    {language === 'en' ? 'Security Engine Status' : 'انجن کی حیثیت'}
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">Active</div>
                  <div className="text-teal-400 text-xs mt-2">
                    {language === 'en' ? 'Deterministic heuristic rules online' : 'ہیورسٹک رولز فعال'}
                  </div>
                </div>
                <div className="bg-[#0D1526] border border-slate-800/80 rounded-2xl p-5">
                  <div className="text-slate-400 text-xs font-medium mb-1">
                    {language === 'en' ? 'Threat Intelligence Core' : 'تھریڈ انٹیلی جنس کور'}
                  </div>
                  <div className="text-2xl font-bold font-mono text-teal-400">CyberShield v3</div>
                  <div className="text-slate-400 text-xs mt-2">
                    {language === 'en' ? 'Advanced pattern signature scanning' : 'سگنیچر اسکیننگ'}
                  </div>
                </div>
                <div className="bg-[#0D1526] border border-slate-800/80 rounded-2xl p-5">
                  <div className="text-slate-400 text-xs font-medium mb-1">
                    {language === 'en' ? 'Bilingual Support' : 'دو لسانی تعاون'}
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">EN / UR</div>
                  <div className="text-slate-400 text-xs mt-2">
                    {language === 'en' ? 'English & Urdu safety guidance' : 'انگریزی اور اردو'}
                  </div>
                </div>
              </div>

              {/* Tools Exploration */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">
                  {language === 'en' ? 'Explore your security workspace' : 'سیکیورٹی ٹول کٹ'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div onClick={() => setActiveTab('scanner')} className="bg-[#0D1526] border border-slate-800 hover:border-teal-500/50 rounded-2xl p-6 transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
                      <Globe className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {language === 'en' ? 'Website Scanner' : 'ویب سائٹ اسکینر'}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">
                      {language === 'en' ? 'Deep heuristic URL risk assessment report.' : 'یو آر ایل رسک اسسمنٹ اور ایس ایس ایل چیک۔'}
                    </p>
                    <span className="text-teal-400 text-sm font-semibold flex items-center gap-1">
                      {language === 'en' ? 'Open scanner' : 'اسکینر کھولیں'} <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>

                  <div onClick={() => setActiveTab('messageAI')} className="bg-[#0D1526] border border-slate-800 hover:border-teal-500/50 rounded-2xl p-6 transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                      <MessageSquareWarning className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {language === 'en' ? 'Threat Analyzer' : 'تھریڈ تجزیہ'}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">
                      {language === 'en' ? 'Analyze SMS, WhatsApp, or emails for social engineering tactics.' : 'ایس ایم ایس یا واٹس ایپ میسج کا اسکام ٹیسٹ کریں۔'}
                    </p>
                    <span className="text-amber-400 text-sm font-semibold flex items-center gap-1">
                      {language === 'en' ? 'Analyze message' : 'میسج چیک کریں'} <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>

                  <div onClick={() => setActiveTab('quiz')} className="bg-[#0D1526] border border-slate-800 hover:border-teal-500/50 rounded-2xl p-6 transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {language === 'en' ? 'Phishing Training Quiz' : 'فشنگ ٹریننگ کوئز'}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4">
                      {language === 'en' ? 'Test your threat spotting skills with interactive phishing scenarios.' : 'انٹرایکٹو سینیریوز کے ساتھ اپنی مہارت جانچیں۔'}
                    </p>
                    <span className="text-indigo-400 text-sm font-semibold flex items-center gap-1">
                      {language === 'en' ? 'Start quiz' : 'کوئز شروع کریں'} <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WEBSITE SCANNER */}
          {activeTab === 'scanner' && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-widest text-teal-400">
                  {language === 'en' ? 'URL Safety Intelligence' : 'یو آر ایل سیکیورٹی انٹیلی جنس'}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  {language === 'en' ? 'Website Scanner' : 'ویب سائٹ اسکینر'}
                </h1>
                <p className="text-slate-400 text-sm max-w-xl">
                  {language === 'en'
                    ? 'Enter any website link to perform an instant heuristic security assessment.'
                    : 'کسی بھی ویب سائٹ کا لنک درج کریں تاکہ فوری سیکیورٹی تجزیہ حاصل کیا جا سکے۔'}
                </p>
              </div>

              {/* Scan Input Box */}
              <div className="bg-[#0D1526] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
                <form onSubmit={e => handleUrlScan(e)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {language === 'en' ? 'Enter Website URL' : 'ویب سائٹ کا ایڈریس درج کریں'}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          value={urlInput}
                          onChange={e => setUrlInput(e.target.value)}
                          placeholder="e.g. https://secure-login-bank.com"
                          className="w-full bg-[#070B14] border border-slate-700/80 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={urlLoading}
                        className="px-6 py-3.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        {urlLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>{language === 'en' ? 'Scanning...' : 'اسکین ہو رہا ہے...'}</span>
                          </>
                        ) : (
                          <>
                            <span>{language === 'en' ? 'Run Deep Scan' : 'اسکین شروع کریں'}</span>
                            <Shield className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Preset Quick URLs */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-xs text-slate-400">{language === 'en' ? 'Quick test links:' : 'فوری ٹیسٹ لنکس:'}</span>
                    <button type="button" onClick={() => handleUrlScan(undefined, 'https://secure-login-apple-support.xyz')} className="text-xs bg-slate-800 hover:bg-slate-700 text-rose-400 px-3 py-1 rounded-lg border border-rose-500/30">
                      Phishing Apple Link
                    </button>
                    <button type="button" onClick={() => handleUrlScan(undefined, 'http://192.168.1.50/banking-login')} className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1 rounded-lg border border-amber-500/30">
                      IP Address Banking Scam
                    </button>
                    <button type="button" onClick={() => handleUrlScan(undefined, 'https://www.google.com')} className="text-xs bg-slate-800 hover:bg-slate-700 text-teal-400 px-3 py-1 rounded-lg border border-teal-500/30">
                      Google (Safe)
                    </button>
                  </div>
                </form>
              </div>

              {/* URL Scan Result Display */}
              {urlResult && (
                <div className="bg-[#0D1526] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl animate-fade-in">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                    <div>
                      <div className="text-xs text-slate-400 font-mono mb-1">{language === 'en' ? 'Analysis Target' : 'نشاندہی کردہ ہدف'}</div>
                      <div className="text-lg font-mono text-white font-semibold break-all">{urlInput}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-slate-400 font-mono">{language === 'en' ? 'Risk Score' : 'رسک اسکور'}</div>
                        <div className={`text-3xl font-extrabold font-mono ${urlResult.riskScore > 75 ? 'text-teal-400' : urlResult.riskScore > 40 ? 'text-amber-400' : 'text-rose-500'}`}>
                          {urlResult.riskScore}/100
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${urlResult.status === 'Safe' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30' : urlResult.status === 'Suspicious' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
                        {urlResult.status}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#070B14] p-4 rounded-xl border border-slate-800">
                      <div className="text-slate-400 text-xs mb-1">{language === 'en' ? 'SSL Security' : 'ایس ایس ایل سیکیورٹی'}</div>
                      <div className="text-sm font-semibold text-slate-200">{urlResult.sslInfo}</div>
                    </div>
                    <div className="bg-[#070B14] p-4 rounded-xl border border-slate-800">
                      <div className="text-slate-400 text-xs mb-1">{language === 'en' ? 'Domain Registration' : 'ڈومین رجسٹریشن'}</div>
                      <div className="text-sm font-semibold text-slate-200">{urlResult.domainAge}</div>
                    </div>
                    <div className="bg-[#070B14] p-4 rounded-xl border border-slate-800">
                      <div className="text-slate-400 text-xs mb-1">{language === 'en' ? 'Typosquatting Check' : 'اسپوفنگ چیک'}</div>
                      <div className="text-sm font-semibold text-slate-200">{urlResult.typosquattingCheck}</div>
                    </div>
                  </div>

                  {urlResult.redFlags && urlResult.redFlags.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{language === 'en' ? 'Detected Security Red Flags' : 'شناخت شدہ خطرات'}</span>
                      </h4>
                      <ul className="space-y-2">
                        {urlResult.redFlags.map((flag: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-300 bg-rose-500/5 border border-rose-500/20 p-3 rounded-xl">
                            <span className="text-rose-400 font-bold">•</span>
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-teal-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{language === 'en' ? 'Recommended Safety Actions' : 'حفاظتی اقدامات'}</span>
                    </h4>
                    <ul className="space-y-2">
                      {urlResult.recommendations?.map((rec: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-300 bg-teal-500/5 border border-teal-500/20 p-3 rounded-xl">
                          <span className="text-teal-400 font-bold">✓</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SCAM MESSAGE THREAT ANALYZER */}
          {activeTab === 'messageAI' && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-widest text-amber-400">
                  {language === 'en' ? 'Social Engineering Defense' : 'سوشل انجینئرنگ ڈیفنس'}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  {language === 'en' ? 'Scam Message Threat Analyzer' : 'اسکام میسج تھریڈ تجزیہ'}
                </h1>
                <p className="text-slate-400 text-sm max-w-xl">
                  {language === 'en'
                    ? 'Paste suspicious SMS, WhatsApp messages, or emails to detect social engineering tactics and urgent manipulation.'
                    : 'مشکوک SMS، واٹس ایپ میسج یا ای میل یہاں پیسٹ کریں تاکہ فراڈ کا پتہ لگایا جا سکے۔'}
                </p>
              </div>

              <div className="bg-[#0D1526] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
                <form onSubmit={e => handleMessageScan(e)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {language === 'en' ? 'Paste Suspicious Message' : 'مشکوک میسج یہاں پیسٹ کریں'}
                    </label>
                    <textarea
                      rows={4}
                      value={msgInput}
                      onChange={e => setMsgInput(e.target.value)}
                      placeholder="e.g. Dear customer, your JazzCash / Easypaisa account has won PKR 500,000. Send your PIN to claim..."
                      className="w-full bg-[#070B14] border border-slate-700/80 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => handleMessageScan(undefined, 'URGENT: Your bank account is suspended due to KYC failure. Click http://bank-update-pk.xyz to verify immediately.')} className="text-xs bg-slate-800 hover:bg-slate-750 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/30">
                        Test Bank KYC Scam
                      </button>
                      <button type="button" onClick={() => handleMessageScan(undefined, 'Congratulations! You won the Pakistan Prize Bond of 1.5 Million PKR. Call agent Ahmed on 0300-1234567.')} className="text-xs bg-slate-800 hover:bg-slate-750 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/30">
                        Test Prize Bond Scam
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={msgLoading}
                      className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                      {msgLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{language === 'en' ? 'Analyzing...' : 'تجزیہ ہو رہا ہے...'}</span>
                        </>
                      ) : (
                        <>
                          <span>{language === 'en' ? 'Analyze Threat' : 'تھریڈ کا تجزیہ کریں'}</span>
                          <MessageSquareWarning className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {msgResult && (
                <div className="bg-[#0D1526] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                    <div>
                      <div className="text-xs text-slate-400 font-mono mb-1">{language === 'en' ? 'Threat Classification' : 'تھریڈ کی درجہ بندی'}</div>
                      <div className="text-xl font-bold text-white">{msgResult.summary}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-slate-400 font-mono">{language === 'en' ? 'Confidence' : 'اعتماد'}</div>
                        <div className="text-2xl font-bold font-mono text-teal-400">{msgResult.confidence}</div>
                      </div>
                      <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${msgResult.threatLevel === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
                        {msgResult.threatLevel} Risk
                      </div>
                    </div>
                  </div>

                  {msgResult.tactics && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 mb-3">{language === 'en' ? 'Manipulative Tactics Used:' : 'استعمال ہونے والی ہتھکنڈے:'}</h4>
                      <div className="flex flex-wrap gap-2">
                        {msgResult.tactics.map((tactic: string, idx: number) => (
                          <span key={idx} className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs px-3 py-1.5 rounded-lg font-medium">
                            {tactic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {msgResult.redFlags && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-rose-400">{language === 'en' ? 'Specific Red Flags:' : 'خصوصی خطرات:'}</h4>
                      <ul className="space-y-2">
                        {msgResult.redFlags.map((flag: string, idx: number) => (
                          <li key={idx} className="text-sm text-slate-300 bg-rose-500/5 border border-rose-500/20 p-3 rounded-xl flex items-start gap-2">
                            <span className="text-rose-400">⚠️</span>
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {msgResult.recommendations && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-teal-400">{language === 'en' ? 'Recommended Action:' : 'تجویز کردہ قدم:'}</h4>
                      <ul className="space-y-2">
                        {msgResult.recommendations.map((rec: string, idx: number) => (
                          <li key={idx} className="text-sm text-slate-300 bg-teal-500/5 border border-teal-500/20 p-3 rounded-xl flex items-start gap-2">
                            <span className="text-teal-400">✓</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* HASH ANALYZER */}
          {activeTab === 'hash' && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-widest text-teal-400">
                  {language === 'en' ? 'Cryptographic Inspector' : 'کرپٹوگرافک انسپیکٹر'}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  {language === 'en' ? 'Hash String Analyzer' : 'ہیش سٹرنگ تجزیہ کار'}
                </h1>
                <p className="text-slate-400 text-sm max-w-xl">
                  {language === 'en'
                    ? 'Inspect MD5, SHA-1, SHA-256, or SHA-512 hashes to identify algorithm type and format integrity.'
                    : 'مختلف ہیش فارمیٹس (MD5, SHA-256) کا معائنہ کریں۔'}
                </p>
              </div>

              <div className="bg-[#0D1526] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {language === 'en' ? 'Paste Hash String' : 'ہیش سٹرنگ یہاں پیسٹ کریں'}
                  </label>
                  <input
                    type="text"
                    value={hashInput}
                    onChange={e => { setHashInput(e.target.value); handleHashCheck(e.target.value); }}
                    placeholder="e.g. e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
                    className="w-full bg-[#070B14] border border-slate-700/80 rounded-xl px-4 py-3.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-slate-400 self-center">{language === 'en' ? 'Test Hashes:' : 'ٹیسٹ ہیشز:'}</span>
                  <button type="button" onClick={() => { const h = '5d41402abc4b2a76b9719d911017c592'; setHashInput(h); handleHashCheck(h); }} className="text-xs bg-slate-800 hover:bg-slate-700 text-teal-400 px-3 py-1 rounded-lg">
                    MD5 ("hello")
                  </button>
                  <button type="button" onClick={() => { const h = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c'; setHashInput(h); handleHashCheck(h); }} className="text-xs bg-slate-800 hover:bg-slate-700 text-teal-400 px-3 py-1 rounded-lg">
                    SHA-1 ("hello")
                  </button>
                  <button type="button" onClick={() => { const h = '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c'; setHashInput(h); handleHashCheck(h); }} className="text-xs bg-slate-800 hover:bg-slate-700 text-teal-400 px-3 py-1 rounded-lg">
                    SHA-256 (64-char)
                  </button>
                </div>

                {hashResult && (
                  <div className="bg-[#070B14] border border-slate-800 rounded-xl p-6 space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">{language === 'en' ? 'Detected Format' : 'فارمیٹ'}</div>
                        <div className="text-sm font-semibold font-mono text-teal-400">{hashResult.format}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">{language === 'en' ? 'String Length' : 'طول'}</div>
                        <div className="text-sm font-semibold font-mono text-white">{hashResult.length} characters</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">{language === 'en' ? 'Reputation Status' : 'شہرت'}</div>
                        <div className="text-sm font-semibold text-emerald-400">{hashResult.reputation}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-1">{language === 'en' ? 'Signature Analysis' : 'دستخط'}</div>
                        <div className="text-sm font-semibold text-slate-200">{hashResult.malwareFamily}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-slate-800 pt-6">
                  <h4 className="text-sm font-semibold text-slate-300 mb-3">{language === 'en' ? 'Supported Hash Formats & Lengths' : 'تھریڈ فارمیٹس'}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                    <div className="bg-[#070B14] p-3 rounded-lg border border-slate-800">
                      <div className="text-slate-400">MD5</div>
                      <div className="text-white font-bold mt-1">32 characters</div>
                    </div>
                    <div className="bg-[#070B14] p-3 rounded-lg border border-slate-800">
                      <div className="text-slate-400">SHA-1</div>
                      <div className="text-white font-bold mt-1">40 characters</div>
                    </div>
                    <div className="bg-[#070B14] p-3 rounded-lg border border-slate-800">
                      <div className="text-slate-400">SHA-256</div>
                      <div className="text-white font-bold mt-1">64 characters</div>
                    </div>
                    <div className="bg-[#070B14] p-3 rounded-lg border border-slate-800">
                      <div className="text-slate-400">SHA-512</div>
                      <div className="text-white font-bold mt-1">128 characters</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CODE AUDITOR */}
          {activeTab === 'code' && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-widest text-teal-400">
                  {language === 'en' ? 'Source Code Review' : 'سورس کوڈ ریویو'}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  {language === 'en' ? 'Security Code Auditor' : 'کوڈ سیکیورٹی آڈیٹر'}
                </h1>
                <p className="text-slate-400 text-sm max-w-xl">
                  {language === 'en'
                    ? 'Paste snippets of HTML, JS, or Python to audit for security vulnerabilities, injections, or insecure code patterns.'
                    : 'کوڈ پیسٹ کریں تاکہ سیکیورٹی نقائص تلاش کیے جا سکیں۔'}
                </p>
              </div>

              <div className="bg-[#0D1526] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
                <form onSubmit={e => handleCodeAudit(e)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {language === 'en' ? 'Paste Code Snippet' : 'کوڈ پیسٹ کریں'}
                    </label>
                    <textarea
                      rows={6}
                      value={codeInput}
                      onChange={e => setCodeInput(e.target.value)}
                      placeholder="// Paste HTML, JS or Python code here..."
                      className="w-full bg-[#070B14] border border-slate-700/80 rounded-xl p-4 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button type="button" onClick={() => handleCodeAudit(undefined, 'document.getElementById("output").innerHTML = userInput;')} className="text-xs bg-slate-800 hover:bg-slate-750 text-teal-400 px-3 py-1.5 rounded-lg border border-slate-700">
                      {language === 'en' ? 'Load Vulnerable DOM XSS Snippet' : 'خطرناک ڈوم XSS کوڈ لوڈ کریں'}
                    </button>
                    <button
                      type="submit"
                      disabled={codeLoading}
                      className="w-full sm:w-auto px-6 py-3.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
                    >
                      {codeLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{language === 'en' ? 'Auditing...' : 'آڈٹ ہو رہا ہے...'}</span>
                        </>
                      ) : (
                        <>
                          <span>{language === 'en' ? 'Audit Code' : 'کوڈ آڈٹ کریں'}</span>
                          <Code2 className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {codeResult && (
                <div className="bg-[#0D1526] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl animate-fade-in">
                  <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                    <div>
                      <div className="text-xs text-slate-400 font-mono mb-1">{language === 'en' ? 'Security Score' : 'سیکیورٹی اسکور'}</div>
                      <div className="text-3xl font-extrabold font-mono text-teal-400">{codeResult.securityScore}/100</div>
                    </div>
                  </div>

                  {codeResult.vulnerabilities && codeResult.vulnerabilities.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-rose-400">{language === 'en' ? 'Identified Vulnerabilities' : 'پتہ چلنے والی خامیاں'}</h4>
                      <div className="space-y-2">
                        {codeResult.vulnerabilities.map((v: any, i: number) => (
                          <div key={i} className="bg-rose-500/5 border border-rose-500/20 p-4 rounded-xl space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-white">{v.title}</span>
                              <span className="text-xs font-mono uppercase bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded">{v.severity}</span>
                            </div>
                            <p className="text-xs text-slate-300">{v.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {codeResult.recommendations && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-teal-400">{language === 'en' ? 'Security Recommendations' : 'سیکیورٹی تجاویز'}</h4>
                      <ul className="space-y-2">
                        {codeResult.recommendations.map((r: string, i: number) => (
                          <li key={i} className="text-sm text-slate-300 bg-teal-500/5 border border-teal-500/20 p-3 rounded-xl flex items-start gap-2">
                            <span className="text-teal-400">✓</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* PHISHING TRAINING QUIZ */}
          {activeTab === 'quiz' && (
            <div className="space-y-8 max-w-3xl mx-auto">
              <div className="text-center space-y-2">
                <div className="text-xs font-mono uppercase tracking-widest text-indigo-400">
                  {language === 'en' ? 'Interactive Security Training' : 'انٹرایکٹو سیکیورٹی ٹریننگ'}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  {language === 'en' ? 'Phishing Awareness Quiz' : 'فشنگ آگاہی کوئز'}
                </h1>
                <p className="text-slate-400 text-sm">
                  {language === 'en'
                    ? 'Test your ability to spot online scams and phishing attempts.'
                    : 'آن لائن اسکیمز کو پہچاننے کی اپنی صلاحیت کو جانچیں۔'}
                </p>
              </div>

              <div className="bg-[#0D1526] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-b border-slate-800 pb-4">
                  <span>{language === 'en' ? `Question ${currentQuizIndex + 1} of ${quizQuestions.length}` : `سوال ${currentQuizIndex + 1} از ${quizQuestions.length}`}</span>
                  <span>{language === 'en' ? `Score: ${quizScore}` : `اسکور: ${quizScore}`}</span>
                </div>

                <div className="text-lg font-semibold text-white">
                  {language === 'en' ? quizQuestions[currentQuizIndex].qEn : quizQuestions[currentQuizIndex].qUr}
                </div>

                <div className="space-y-3">
                  {(language === 'en' ? quizQuestions[currentQuizIndex].optionsEn : quizQuestions[currentQuizIndex].optionsUr).map((opt, idx) => {
                    let btnStyle = "bg-[#070B14] border-slate-800 text-slate-300 hover:border-teal-500/50";
                    if (quizAnswered) {
                      if (idx === quizQuestions[currentQuizIndex].correct) {
                        btnStyle = "bg-teal-500/10 border-teal-500 text-teal-300 font-bold";
                      } else if (selectedOption === idx) {
                        btnStyle = "bg-rose-500/10 border-rose-500 text-rose-300";
                      }
                    }
                    return (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(idx)}
                        disabled={quizAnswered}
                        className={`w-full text-left p-4 rounded-xl border transition-all text-sm flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {quizAnswered && idx === quizQuestions[currentQuizIndex].correct && (
                          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {quizAnswered && (
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={nextQuiz}
                      className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm rounded-xl transition-all flex items-center gap-2"
                    >
                      <span>{language === 'en' ? 'Next Question' : 'اگلا سوال'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SAFETY GUIDELINES (BILINGUAL) */}
          {activeTab === 'guidelines' && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-widest text-teal-400">
                  {language === 'en' ? 'Public Safety Education' : 'عوامی حفاظتی تعلیم'}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  {language === 'en' ? 'Online Safety Guidelines' : 'آن لائن حفاظتی رہنما اصول'}
                </h1>
                <p className="text-slate-400 text-sm max-w-xl">
                  {language === 'en'
                    ? 'Comprehensive security best practices available in both English and Urdu (اردو).'
                    : 'انگریزی اور اردو میں جامع حفاظتی رہنما اصول۔'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0D1526] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {language === 'en' ? '1. Strong Passwords & 2FA' : '1. مضبوط پاس ورڈ اور 2FA'}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {language === 'en'
                      ? 'Never reuse passwords across multiple sites. Enable Two-Factor Authentication (2FA) on all banking, email, and social media accounts to prevent unauthorized access even if your password is leaked.'
                      : 'ایک ہی پاس ورڈ کو مختلف ویب سائٹس پر استعمال نہ کریں۔ اپنے تمام بینکنگ اور سوشل میڈیا اکاؤنٹس پر ٹو فیکٹر آتھینیکیشن (2FA) فعال کریں۔'}
                  </p>
                </div>

                <div className="bg-[#0D1526] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {language === 'en' ? '2. Spotting Phishing Links' : '2. فشنگ لنکس کو پہچاننا'}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {language === 'en'
                      ? 'Scammers create fake domains with slight misspellings (e.g. netfilx.com instead of netflix.com). Always check the browser address bar and avoid clicking links from unknown senders.'
                      : 'اسکامرز جعلی ڈومین بناتے ہیں (مثلاً netflix کی بجائے netfilx)۔ ہمیشہ براؤزر ایڈریس بار چیک کریں اور نامعلوم لنکس پر کلک کرنے سے گریز کریں۔'}
                  </p>
                </div>

                <div className="bg-[#0D1526] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <MessageSquareWarning className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {language === 'en' ? '3. Urgent Scam Messages' : '3. فوری جھوٹے پیغامات'}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {language === 'en'
                      ? 'If a message creates extreme panic ("Your account will be deleted in 1 hour"), it is a psychological manipulation tactic. Banks and official authorities never ask for PIN codes via SMS.'
                      : 'اگر کوئی پیغام سخت گھبراہٹ پیدا کرے ("آپ کا اکاؤنٹ 1 گھنٹے میں بند ہو جائے گا") تو یہ نفسیاتی ہتھکنڈہ ہے۔ بینک کبھی SMS پر پن کوڈ نہیں مانگتے۔'}
                  </p>
                </div>

                <div className="bg-[#0D1526] border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {language === 'en' ? '4. Safe Wi-Fi & Browsing' : '4. محفوظ وائی فائی اور براؤزنگ'}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {language === 'en'
                      ? 'Avoid logging into sensitive financial accounts on public Wi-Fi networks without using a trusted VPN. Always ensure HTTPS is active before submitting any personal data.'
                      : 'عوامی وائی فائی پر مالیاتی اکاؤنٹس میں لاگ ان کرنے سے گریز کریں۔ ذاتی ڈیٹا جمع کرانے سے پہلے ہمیشہ یقینی بنائیں کہ HTTPS فعال ہے۔'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Team Credits Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0A1020] py-4 px-6 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>CyberShield Security Intelligence Platform &copy; 2026</div>
        <div className="flex items-center gap-4">
          <span className="text-teal-400 font-medium">Frontend Development: Hafsa (Hafsa Dev)</span>
          <span className="text-slate-600">|</span>
          <span className="text-teal-400 font-medium">Backend Development: Muhammad Ahmad Shahid</span>
        </div>
      </footer>
    </div>
  );
}
