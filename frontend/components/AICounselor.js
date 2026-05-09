import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';

export default function AICounselor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I am your AI College Counselor. Ask me about cutoffs, placements, or predicting your chances!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    // Mock AI Response Logic
    setTimeout(() => {
      let aiResponse = "I'm not sure about that. Could you ask me about cutoffs or finding colleges?";
      
      const lower = userMessage.toLowerCase();
      if (lower.includes('chance') || lower.includes('predict') || lower.includes('rank')) {
        aiResponse = "To accurately predict your chances, please visit our Predictor tool. I can help you analyze your specific exam ranks across our database of 50,000+ cutoffs.";
        setTimeout(() => {
          if(router.pathname !== '/predict') router.push('/predict');
        }, 3000);
      } else if (lower.includes('placement') || lower.includes('salary') || lower.includes('package')) {
        aiResponse = "Top colleges on our platform average between 8-15 LPA. The highest packages often go to Computer Science branches, frequently exceeding 40 LPA at premier institutes. Have you checked out the Placements tab on college detail pages?";
      } else if (lower.includes('fee') || lower.includes('cost')) {
        aiResponse = "Fees vary widely. Government colleges (like NITs) usually charge 1-2 Lakhs/year, while private institutes can charge 3-5 Lakhs/year. Have you tried our new ROI Calculator on the college pages to see if it's worth the investment?";
      } else if (lower.includes('hello') || lower.includes('hi')) {
        aiResponse = "Hello! How can I help you with your college search today?";
      } else if (lower.includes('best') || lower.includes('top')) {
         aiResponse = "It depends on what you're looking for! If you prioritize ROI, Jadavpur University is excellent. For pure placements, IITs and top NITs are the best. Try using the Compare tool to see them side-by-side.";
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-110 transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <div className="relative">
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-400"></span>
          </span>
        </div>
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right flex flex-col ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`} style={{ height: '500px', maxHeight: 'calc(100vh - 100px)' }}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white flex items-center gap-1.5">
                AI Counselor <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </h3>
              <p className="text-xs text-indigo-100 font-medium">Online • Powered by AI</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-900/50 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-violet-500/20 text-violet-400'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-sm' 
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-violet-500/20 text-violet-400">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 rounded-tl-sm text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-800/80 border-t border-slate-700 shrink-0">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
