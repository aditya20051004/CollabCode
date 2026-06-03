import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageSquare } from "lucide-react";
import { UserAvatar, getAvatarColor } from "./OnlineUsers";
import { socket } from "../socket";

interface Message {
  id?: string;
  username: string;
  message: string;
  timestamp?: number;
}

interface ChatPanelProps {
  messages: Message[];
  currentUsername: string;
  onSendMessage: (message: string) => void;
  collapsed: boolean;
  typingUser: string;
}

const formatTime = (ts?: number): string => {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const ChatBubble: React.FC<{
  msg: Message;
  isOwn: boolean;
  showAvatar: boolean;
  index: number;
}> = ({ msg, isOwn, showAvatar, index }) => {
  const color = getAvatarColor(msg.username);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1],
      }}
      style={{
        display: "flex",
        flexDirection: isOwn ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: "8px",
        padding: "3px 12px",
      }}
    >
      {/* Avatar */}
      {!isOwn && (
        <div style={{ flexShrink: 0, marginBottom: "2px" }}>
          {showAvatar ? (
            <UserAvatar username={msg.username} size={24} />
          ) : (
            <div style={{ width: 24 }} />
          )}
        </div>
      )}

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: isOwn ? "flex-end" : "flex-start",
          maxWidth: "76%",
          gap: "2px",
        }}
      >
        {/* Username */}
        {showAvatar && !isOwn && (
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              color,
              paddingLeft: "2px",
            }}
          >
            {msg.username}
          </span>
        )}

        {/* Bubble */}
        <div
          style={{
            background: isOwn
              ? "linear-gradient(135deg, var(--accent), #7C7FF4)"
              : "var(--bg-card)",
            color: isOwn ? "#fff" : "var(--text-primary)",
            borderRadius: isOwn
              ? "14px 14px 4px 14px"
              : "4px 14px 14px 14px",
            padding: "8px 12px",
            fontSize: "13px",
            lineHeight: "1.5",
            border: isOwn ? "none" : "1px solid var(--border-subtle)",
            boxShadow: isOwn ? "var(--shadow-accent)" : "var(--shadow-sm)",
            wordBreak: "break-word",
          }}
        >
          {msg.message}
        </div>

        {/* Timestamp */}
        {msg.timestamp && (
          <span
            style={{
              fontSize: "10px",
              color: "var(--text-muted)",
              paddingLeft: isOwn ? 0 : "2px",
              paddingRight: isOwn ? "2px" : 0,
            }}
          >
            {formatTime(msg.timestamp)}
          </span>
        )}
      </div>
    </motion.div>
  );
};

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  currentUsername,
  onSendMessage,
  collapsed,
  typingUser,
}) => {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {!collapsed && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "var(--chat-width)", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{
            height: "100%",
            background: "var(--bg-surface)",
            borderLeft: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            style={{
              width: "var(--chat-width)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "8px 10px",
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexShrink: 0,
              }}
            >
              <MessageSquare size={14} color="var(--accent)" />
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  flex: 1,
                }}
              >
                Chat
              </span>
              <span
                style={{
                  fontSize: "10px",
                  color: "var(--accent)",
                  background: "var(--accent-subtle)",
                  padding: "1px 6px",
                  borderRadius: "var(--radius-full)",
                  fontWeight: 700,
                }}
              >
                {messages.length}
              </span>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                padding: "12px 0",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              {messages.length === 0 ? (
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    color: "var(--text-muted)",
                    padding: "24px",
                  }}
                >
                  <MessageSquare size={28} strokeWidth={1} />
                  <p style={{ fontSize: "13px", textAlign: "center" }}>
                    No messages yet.
                    <br />
                    Say hello! 👋
                  </p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => {
                    const isOwn = msg.username === currentUsername;
                    const prev = messages[i - 1];
                    const showAvatar = !prev || prev.username !== msg.username;
                    return (
                      <ChatBubble
                        key={msg.id || `${msg.username}-${i}`}
                        msg={msg}
                        isOwn={isOwn}
                        showAvatar={showAvatar}
                        index={i}
                      />
                    );
                  })}
                </AnimatePresence>
              )}
              <div ref={bottomRef} />
            </div>
            {typingUser && (
  <div
    style={{
      padding: "6px 12px",
      fontSize: "12px",
      color: "var(--text-muted)",
      fontStyle: "italic",
    }}
  >
    {typingUser} is typing...
  </div>
)}

            {/* Input */}
            <div
              style={{
                padding: "6px",
                borderTop: "1px solid var(--border-subtle)",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "8px",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: "8px 8px 8px 12px",
                  transition: "border-color var(--transition-fast)",
                }}
                onFocus={() => {}}
              >
                <textarea
                  value={input}
                  onChange={(e) => {

  setInput(e.target.value);

        socket.emit("typing");

}}
                  onKeyDown={handleKeyDown}
                  placeholder="Message..."
                  rows={1}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "var(--text-primary)",
                    fontSize: "13px",
                    fontFamily: "var(--font-sans)",
                    resize: "none",
                    lineHeight: "1.5",
                    maxHeight: "80px",
                    overflowY: "auto",
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  disabled={!input.trim()}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    background: input.trim()
                      ? "linear-gradient(135deg, var(--accent), #8B5CF6)"
                      : "var(--bg-card)",
                    color: input.trim() ? "#fff" : "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: input.trim() ? "pointer" : "default",
                    flexShrink: 0,
                    transition: "all var(--transition-fast)",
                    boxShadow: input.trim() ? "var(--shadow-accent)" : "none",
                  }}
                >
                  <Send size={13} />
                </motion.button>
              </div>
              <p
                style={{
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  marginTop: "5px",
                  paddingLeft: "2px",
                }}
              >
                Enter to send · Shift+Enter for newline
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatPanel;
