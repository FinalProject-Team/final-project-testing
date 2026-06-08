import { supabase } from '../../lib/supabaseClient';

// ── GROQ ────────────────────────────────────────────────────────────
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API;
const GROQ_URL     = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL        = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are CareerAI, an expert career advisor built into the CareerTech platform.
You help users with: roadmap planning, resume writing, interview preparation, project ideas,
skill development, salary negotiation, LinkedIn optimization, and career transitions.
Be concise, warm, practical, and encouraging. Use **bold** for key terms.
Use bullet lists where helpful. Always give actionable, specific advice.`;

// ── GROQ: send messages and get AI reply ────────────────────────────
export async function sendMessage(messages) {
  if (!GROQ_API_KEY) throw new Error('VITE_GROQ_API is not set in your .env file');

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(({ role, content }) => ({ role, content })),
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Groq error ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
}

// ── SUPABASE: save one message ───────────────────────────────────────
export async function saveMessage({ role, content }) {
  if (!supabase) {
    console.warn('Supabase not configured — message not saved.');
    return null;
  }
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([{ role, content }]);
  if (error) console.error('Supabase insert error:', error.message);
  return data;
}

// ── SUPABASE: load chat history (last 50 messages) ───────────────────
export async function loadHistory() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('chat_messages')
    .select('role, content, created_at')
    .order('created_at', { ascending: true })
    .limit(50);

  if (error) {
    console.error('Supabase fetch error:', error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    role:    row.role,
    content: row.content,
    time:    new Date(row.created_at).toLocaleTimeString([], {
      hour:   '2-digit',
      minute: '2-digit',
    }),
  }));
}

// ── SUPABASE: clear all history ──────────────────────────────────────
export async function clearHistory() {
  if (!supabase) return;
  await supabase
    .from('chat_messages')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
}
