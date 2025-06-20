const OPENROUTER_API_KEY = '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';

document.addEventListener('DOMContentLoaded', () => {
  // Loading Animation
  const loadingOverlay = document.getElementById('loading-overlay');
  const sections = document.querySelectorAll('.section');
  
  setTimeout(() => {
    loadingOverlay.classList.add('hidden');
    sections.forEach(section => section.classList.add('loaded'));
  }, 1000);

  // Navbar
  const toggleBtn = document.getElementById('chatbot-toggle');
  const closeBtn = document.getElementById('chatbot-close');
  const panel = document.getElementById('chatbot-panel');
  const messages = document.getElementById('chatbot-messages');
  const form = document.getElementById('chatbot-form');
  const input = document.getElementById('chatbot-input');

  toggleBtn.addEventListener('click', () => panel.classList.add('open'));
  closeBtn.addEventListener('click', () => panel.classList.remove('open'));

  const appendMsg = (text, sender = 'bot') => {
    const msg = document.createElement('div');
    msg.className = `msg ${sender}`;
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendMsg(text, 'user');
    input.value = '';
    

    const lower = text.toLowerCase();
    const contactKeywords = ['contact', 'support', 'email', 'phone', 'call', 'message'];
    if (contactKeywords.some(k => lower.includes(k))) {
      appendMsg('📩 For contact-related queries, please fill out the contact form below.', 'bot');
      return;
    }

    const greetings = {
      hi: 'Hello! 👋 How can I assist you today?',
      hello: 'Hey there! 😊 What can I help you with?',
      hey: 'Hi! Need any help?',
      'how are you': 'I’m doing great! 🤖 How can I help you?',
      'who are you': 'I’m Asur AI, created by Subhadip Dey.',
      hlw: 'Hello buddy How Are You?'
    };

    const greetingKey = Object.keys(greetings).find(k => lower.includes(k));
    if (greetingKey) {
      appendMsg(greetings[greetingKey], 'bot');
      return;
    }

    appendMsg('Thinking...', 'bot');

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant named Asur, created by Subhadip Dey.' },
            { role: 'user', content: text }
          ],
          max_tokens: 200
        })
      });

      const data = await res.json();
      messages.lastChild.remove();

      if (data.choices && data.choices[0]) {
        appendMsg(data.choices[0].message.content.trim(), 'bot');
      } else {
        appendMsg('❌ Sorry, I couldn’t understand that.', 'bot');
      }
    } catch (err) {
      messages.lastChild.remove();
      appendMsg(`⚠️ Error: ${err.message}`, 'bot');
    }
  });

  // Footer Year
  document.getElementById('year').textContent = new Date().getFullYear();
});