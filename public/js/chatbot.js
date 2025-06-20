const chatbotWidget = document.getElementById('chatbot-widget');
const openChatbotBtn = document.getElementById('open-chatbot');
const chatbotDialog = document.getElementById('chatbot-dialog');
const closeChatbotBtn = document.getElementById('close-chatbot');
const chatbotForm = document.getElementById('chatbot-form');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotMessages = document.getElementById('chatbot-messages');

openChatbotBtn.addEventListener('click', () => {
    chatbotDialog.classList.remove('hidden');
});
closeChatbotBtn.addEventListener('click', () => {
    chatbotDialog.classList.add('hidden');
});
chatbotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userMsg = chatbotInput.value;
    if (!userMsg.trim()) return;
    addMessage("user", userMsg);
    chatbotInput.value = "";
    setTimeout(() => {
        // FAKE GPT/Grok response
        const botReply = getBotReply(userMsg);
        addMessage("bot", botReply);
    }, 700);
});
function addMessage(sender, text) {
    const div = document.createElement('div');
    div.className = sender === "bot" ? "bot-msg" : "user-msg";
    div.textContent = text;
    chatbotMessages.appendChild(div);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}
function getBotReply(msg) {
    // You can integrate with OpenAI/Grok API here
    if (msg.toLowerCase().includes("project")) return "Check out my projects in the Projects section!";
    if (msg.toLowerCase().includes("resume")) return "You can download my resume by clicking the Download button in Resume section.";
    return "I'm here to help! (AI demo only)";
}