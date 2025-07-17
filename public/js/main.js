// WARNING: Never expose API keys in production. Use a server proxy.
const OPENROUTER_API_KEY =
  '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';

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Loading ----------
  const loadingOverlay = document.getElementById('loading-overlay');
  const sections = document.querySelectorAll('.section');
  setTimeout(() => {
    loadingOverlay?.classList?.add('hidden');
    sections.forEach(sec => sec?.classList?.add('loaded'));
  }, 1000);

  // ---------- Panel ----------
  const toggleBtn = document.getElementById('chatbot-toggle');
  const closeBtn  = document.getElementById('chatbot-close');
  const panel     = document.getElementById('chatbot-panel');
  const messages  = document.getElementById('chatbot-messages');
  const form      = document.getElementById('chatbot-form');
  const input     = document.getElementById('chatbot-input');

  const appendMsg = (text, sender = 'bot') => {
    const div = document.createElement('div');
    div.className = `msg ${sender}`;
    div.textContent = String(text);
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  };

  toggleBtn?.addEventListener('click', () => panel?.classList?.add('open'));
  closeBtn?.addEventListener('click',  () => panel?.classList?.remove('open'));

  // ---------- Chat ----------
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendMsg(text, 'user');
    input.value = '';

    const lower = text.toLowerCase();
    const shortcuts = {
      contact: '📩 For contact-related queries, please fill out the contact form below.',
      hi: 'Hello! 👋  How can I assist you today?',
      hello: 'Hey there! 😊  What can I help you with?',
      hey:  'Hi! Need any help?',
      'how are you': 'I’m doing great! 🤖  How can I help you?',
      'who are you': 'I’m Asur AI, created by Subhadip Dey.',
      hlw:  'Hello buddy How Are You?'
    };

    const match = Object.keys(shortcuts).find(k => lower.includes(k));
    if (match) { appendMsg(shortcuts[match], 'bot'); return; }

    appendMsg('Thinking...', 'bot');

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,   // MUST be exactly like this
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-exp:free', // verified free model
          temperature: 0,                            // deterministic
          max_tokens: 200,
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant named Asur, created by Subhadip Dey.' },
            { role: 'user', content: text }
          ]
        })
      });

      const data = await res.json();
      // Remove “Thinking...”
      [...messages.children]
        .filter(n => n.textContent === 'Thinking...')
        .forEach(n => n.remove());

      const reply = data?.choices?.[0]?.message?.content?.trim?.();
      appendMsg(reply || '❌ No reply', 'bot');
    } catch (err) {
      [...messages.children]
        .filter(n => n.textContent === 'Thinking...')
        .forEach(n => n.remove());
      appendMsg(`⛔ ${err.message || 'Network / API error'}`, 'bot');
    }
  });

  // ---------- Footer year ----------
  document.getElementById('year').textContent = new Date().getFullYear();
});
