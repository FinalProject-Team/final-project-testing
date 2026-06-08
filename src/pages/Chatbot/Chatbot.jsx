import { useState, useRef, useEffect, useCallback } from 'react';
import GridBackground from '../../components/Aichat/ChatBot/GridBackground/GridBackground';
import ChatHeader from '../../components/Aichat/ChatBot/ChatHeader/ChatHeader';
import ChatMessage from '../../components/Aichat/ChatMessage/ChatMessage';
import SuggestionChips from '../../components/Aichat/ChatBot/SuggestionChips/SuggestionChips';
import ChatInput from '../../components/Aichat/ChatBot/ChatInput/ChatInput';
import { sendMessage, saveMessage, loadHistory, clearHistory } from '../../services/chat/chatService';
import s from './Chatbot.module.css';


const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi Alex! I'm your AI Career Advisor. I can help you plan your learning journey, prepare for interviews, analyze job opportunities, and guide your career growth. What would you like to explore today?",
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export default function Chatbot() {
  const [messages, setMessages]   = useState([WELCOME]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const bottomRef = useRef(null);

  // Load Supabase history on mount
  useEffect(() => {
    (async () => {
      const history = await loadHistory();
      if (history.length > 0) {
        setMessages([WELCOME, ...history.map((m, i) => ({ id: `h${i}`, ...m }))]);
      }
      setHistoryLoaded(true);
    })();
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = useCallback(async (text) => {
    if (!text.trim() || loading) return;
    setError(null);

    const userMsg = {
      id:      Date.now(),
      role:    'user',
      content: text.trim(),
      time:    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Save user message to Supabase
    await saveMessage({ role: 'user', content: text.trim() });

    try {
      // Build context for Groq (skip welcome placeholder)
      const context = [...messages, userMsg]
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }));

      const reply = await sendMessage(context);

      const aiMsg = {
        id:      Date.now() + 1,
        role:    'assistant',
        content: reply,
        time:    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);

      // Save AI reply to Supabase
      await saveMessage({ role: 'assistant', content: reply });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  const handleClear = useCallback(async () => {
    await clearHistory();
    setMessages([WELCOME]);
    setError(null);
  }, []);

  return (
    <div className={s.page}>
      <GridBackground />
      <div className={s.inner}>
        {/* Header — pass onClear so the refresh button works */}
        <ChatHeader onClear={handleClear} />

        {/* Error banner */}
        {error && (
          <div className={s.errorBanner}>
            ⚠️ {error}
            <button className={s.errorClose} onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {/* Messages */}
        <div className={s.messagesArea}>
          {!historyLoaded && (
            <div className={s.loadingHistory}>Loading history…</div>
          )}

          {messages.map(msg =>
            msg.role === 'assistant'
              ? <ChatMessage key={msg.id} text={msg.content} time={msg.time} />
              : <UserMessage  key={msg.id} text={msg.content} time={msg.time} />
          )}

          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Bottom */}
        <div className={s.bottomArea}>
          <SuggestionChips onSelect={handleSend} />
          <ChatInput value={input} onChange={setInput} onSend={handleSend} disabled={loading} />
        </div>
      </div>
    </div>
  );
}

/* ── User bubble ── */
function UserMessage({ text, time }) {
  return (
    <div className={s.userRow}>
      <div className={s.timeStamp}>{time}</div>
      <div className={s.userBubble}>{text}</div>
    </div>
  );
}

/* ── Typing indicator ── */
function TypingIndicator() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'12px', maxWidth:'600px', width:'100%', margin:'0 auto 8px', animation:'fadeIn 0.3s ease both' }}>
      <div style={{
        width:'34px', height:'34px', borderRadius:'9px', flexShrink:0,
        background:'linear-gradient(135deg,#00b4d8,#0077b6)',
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:'0 0 10px rgba(0,180,216,0.25)',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      </div>
      <div style={{
        background:'var(--bg-card)', border:'1px solid var(--border-subtle)',
        borderRadius:'4px 14px 14px 14px', padding:'14px 18px',
        display:'flex', gap:'5px', alignItems:'center',
      }}>
        {[0,1,2].map(i => (
          <span key={i} style={{
            width:'6px', height:'6px', borderRadius:'50%',
            background:'var(--txt-muted)', display:'inline-block',
            animation:`blink 1.2s ease-in-out ${i*0.22}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}
