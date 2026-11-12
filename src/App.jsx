import { useState, useRef, useEffect } from "react";
const makeIcon = (glyph) => function RovantixIcon({ size = 18 }) {
  return <span aria-hidden="true" style={{ display: "inline-grid", placeItems: "center", width: size, height: size, fontSize: Math.max(12, size - 2), lineHeight: 1 }}>{glyph}</span>;
};

const Sparkles = makeIcon("✦");
const Code2 = makeIcon("⌘");
const Gamepad2 = makeIcon("🎮");
const LayoutDashboard = makeIcon("▦");
const FolderOpen = makeIcon("📁");
const Settings = makeIcon("⚙");
const Plus = makeIcon("+");
const Send = makeIcon("➤");
const Bot = makeIcon("◈");
const User = makeIcon("●");
const ChevronDown = makeIcon("⌄");
const PanelLeftClose = makeIcon("☰");
const Zap = makeIcon("⚡");
const Command = makeIcon("⌘");
const MessageSquare = makeIcon("▤");
const WandSparkles = makeIcon("✧");
const Terminal = makeIcon(">_");
const Cpu = makeIcon("▣");
import "./App.css";

const suggestions = [
  { icon: Gamepad2, title: "Build a Roblox game", desc: "Create a complete game concept with mechanics and systems.", prompt: "Help me build a Roblox game with an original concept, gameplay loop, and systems." },
  { icon: Code2, title: "Generate a Lua script", desc: "Create clean, organized Roblox Luau scripts.", prompt: "Create a Roblox Luau script for a modern sprint system with mobile support." },
  { icon: LayoutDashboard, title: "Design a UI", desc: "Plan a modern interface for your game.", prompt: "Design a modern Roblox game UI with a dark futuristic theme." },
  { icon: WandSparkles, title: "Improve my game", desc: "Upgrade existing mechanics and scripts.", prompt: "Give me ideas to improve my Roblox game and make its gameplay more engaging." }
];

function App() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("openai/gpt-5.3-codex");
  const [activePage, setActivePage] = useState("AI Workspace");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text = prompt) {
    const clean = text.trim();
    if (!clean || loading) return;

    setMessages(prev => [...prev, { role: "user", content: clean }]);
    setPrompt("");
    setLoading(true);

    try {
      if (!window.puter?.ai?.chat) {
        throw new Error("Puter.js is not ready. Refresh the page and try again.");
      }

      const response = await window.puter.ai.chat(clean, { model });
      const answer =
        typeof response === "string"
          ? response
          : response?.message?.content ?? response?.text ?? JSON.stringify(response, null, 2);

      setMessages(prev => [...prev, { role: "assistant", content: String(answer) }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I couldn't generate a response: " + (error?.message || "Unknown error") + "\n\nPlease check your Puter.js connection and try again."
      }]);
    } finally {
      setLoading(false);
    }
  }

  function newChat() {
    setMessages([]);
    setPrompt("");
    setActivePage("AI Workspace");
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "" : "sidebar-hidden"}`}>
        <div className="brand">
          <div className="brand-mark"><Sparkles size={21} /></div>
          <div className="brand-name">rovantix<span>AI</span></div>
          <button className="icon-button collapse-button" onClick={() => setSidebarOpen(false)}><PanelLeftClose size={18}/></button>
        </div>

        <button className="new-chat" onClick={newChat}>
          <Plus size={17}/> <span>New workspace</span>
          <kbd>⌘ K</kbd>
        </button>

        <div className="nav-label">WORKSPACE</div>
        <nav className="navigation">
          {[
            { name: "AI Workspace", icon: MessageSquare },
            { name: "Game Builder", icon: Gamepad2 },
            { name: "Script Studio", icon: Code2 },
            { name: "UI Designer", icon: LayoutDashboard },
            { name: "My Projects", icon: FolderOpen }
          ].map(item => (
            <button key={item.name} className={`nav-item ${activePage === item.name ? "active" : ""}`} onClick={() => setActivePage(item.name)}>
              <item.icon size={18}/><span>{item.name}</span>
              {item.name === "AI Workspace" && <span className="nav-dot"/>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="usage-card">
            <div className="usage-icon"><Zap size={16}/></div>
            <div><strong>Rovantix Engine</strong><span>Powered by Puter.js</span></div>
            <span className="online-dot"/>
          </div>
          <button className="nav-item settings-item" onClick={() => setActivePage("Settings")}><Settings size={18}/><span>Settings</span></button>
          <div className="profile">
            <div className="avatar">R</div>
            <div className="profile-info"><strong>Creator</strong><span>Free workspace</span></div>
            <Settings size={16} className="profile-settings"/>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="top-left">
            {!sidebarOpen && <button className="icon-button" onClick={() => setSidebarOpen(true)}><PanelLeftClose size={19}/></button>}
            <span className="breadcrumb">Workspace</span><span className="crumb-slash">/</span><strong>{activePage}</strong>
          </div>
          <div className="top-right">
            <div className="status-pill"><span className="online-dot"/> Engine ready</div>
            <div className="top-avatar">R</div>
          </div>
        </header>

        <section className="workspace">
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="welcome-chip"><Sparkles size={14}/> YOUR AI GAME CREATION STUDIO</div>
              <h1>Imagine it.<br/><span>Build it with AI.</span></h1>
              <p className="welcome-description">Your creative workspace for building games, generating scripts, and designing experiences. What are we creating today?</p>

              <div className="prompt-box">
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Describe what you want to create..."
                  rows={3}
                />
                <div className="prompt-toolbar">
                  <div className="model-select">
                    <Cpu size={15}/>
                    <select value={model} onChange={e => setModel(e.target.value)}>
                      <option value="openai/gpt-5.3-codex">GPT-5.3 Codex</option>
                    </select>
                    <ChevronDown size={13}/>
                  </div>
                  <div className="send-area">
                    <span>Enter to send</span>
                    <button className="send-button" onClick={() => sendMessage()} disabled={!prompt.trim() || loading}><Send size={17}/></button>
                  </div>
                </div>
              </div>

              <div className="suggestion-heading"><span>QUICK START</span><div/></div>
              <div className="suggestion-grid">
                {suggestions.map(item => (
                  <button className="suggestion-card" key={item.title} onClick={() => sendMessage(item.prompt)}>
                    <div className="suggestion-icon"><item.icon size={19}/></div>
                    <strong>{item.title}</strong>
                    <span>{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="chat-view">
              <div className="chat-heading"><div className="chat-heading-icon"><Sparkles size={18}/></div><div><strong>Rovantix AI</strong><span>Your creative assistant</span></div></div>
              <div className="messages">
                {messages.map((message, index) => (
                  <div className={`message ${message.role}`} key={index}>
                    <div className="message-avatar">{message.role === "assistant" ? <Sparkles size={16}/> : <User size={16}/>}</div>
                    <div className="message-body"><span className="message-author">{message.role === "assistant" ? "Rovantix AI" : "You"}</span><div className="message-content">{message.content}</div></div>
                  </div>
                ))}
                {loading && <div className="message assistant"><div className="message-avatar"><Sparkles size={16}/></div><div className="message-body"><span className="message-author">Rovantix AI</span><div className="typing"><i/><i/><i/> Thinking...</div></div></div>}
                <div ref={endRef}/>
              </div>
              <div className="chat-composer">
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Message Rovantix AI..." rows={2}/>
                <div className="composer-bottom"><span><Cpu size={14}/> {model}</span><button className="send-button" onClick={() => sendMessage()} disabled={!prompt.trim() || loading}><Send size={17}/></button></div>
              </div>
            </div>
          )}
        </section>
        <footer className="footer"><span><Command size={13}/> ROVANTIX AI</span><span>Build something extraordinary.</span></footer>
      </main>
    </div>
  );
}

export default App;


