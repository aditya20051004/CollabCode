import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Copy,
  Check,
  Wifi,
  WifiOff,
  Users,
  Hash,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  roomId: string;
  isConnected: boolean;
  userCount: number;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  
  onToggleLeft: () => void;
  onToggleAI: () => void;
  onToggleRight: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  roomId,
  isConnected,
  userCount,
  leftCollapsed,
  rightCollapsed,
  onToggleLeft,
  onToggleAI,
  onToggleRight,
}) => {
  const [copied, setCopied] = useState(false);

  const copyRoomLink = () => {
    const url = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.nav
      initial={{ y: -52, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{
        height: "var(--navbar-height)",
        
        background: "var(--bg-glass)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: "12px",
        position: "relative",
        zIndex: 50,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "var(--radius-md)",
            background: "linear-gradient(135deg, var(--accent), #8B5CF6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-accent)",
          }}
        >
          <Code2 size={16} color="#fff" strokeWidth={2.5} />
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            fontSize: "14px",
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          CollabCode
        </span>
      </div>

      {/* Divider */}
      <div
        style={{
          width: 1,
          height: 20,
          background: "var(--border-subtle)",
          flexShrink: 0,
        }}
      />

      {/* Left sidebar toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleLeft}
        style={{
          width: 28,
          height: 28,
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border-subtle)",
          background: leftCollapsed ? "var(--accent-subtle)" : "transparent",
          color: leftCollapsed ? "var(--accent)" : "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
          transition: "all var(--transition-fast)",
        }}
        title="Toggle left sidebar"
      >
        {leftCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </motion.button>

      {/* Room Name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          padding: "5px 10px",
          flexShrink: 0,
        }}
      >
        <Hash size={13} color="var(--text-muted)" />
        <span
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--text-primary)",
            fontFamily: "var(--font-mono)",
            maxWidth: "140px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {roomId}
        </span>
      </div>

      {/* Copy Link */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={copyRoomLink}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "5px 10px",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-subtle)",
          background: copied ? "var(--accent-subtle)" : "transparent",
          color: copied ? "var(--accent)" : "var(--text-secondary)",
          fontSize: "12px",
          fontWeight: 500,
          cursor: "pointer",
          transition: "all var(--transition-fast)",
          flexShrink: 0,
        }}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <Check size={12} />
              Copied!
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <Copy size={12} />
              Share
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* User Count */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          fontSize: "12px",
          color: "var(--text-secondary)",
          flexShrink: 0,
        }}
      >
        <Users size={13} />
        <span>{userCount}</span>
      </div>

      {/* Connection Status */}
      <motion.div
        animate={{
          opacity: [1, 0.6, 1],
        }}
        transition={{
          duration: isConnected ? 3 : 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding: "4px 10px",
          borderRadius: "var(--radius-full)",
          background: isConnected
            ? "rgba(16, 185, 129, 0.1)"
            : "rgba(239, 68, 68, 0.1)",
          border: `1px solid ${isConnected ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
          flexShrink: 0,
        }}
      >
        {isConnected ? (
          <Wifi size={12} color="var(--status-green)" />
        ) : (
          <WifiOff size={12} color="var(--status-red)" />
        )}
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: isConnected ? "var(--status-green)" : "var(--status-red)",
            letterSpacing: "0.02em",
          }}
        >
          {isConnected ? "Live" : "Offline"}
        </span>
      </motion.div>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Right sidebar toggle */}
      <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={onToggleAI}
  style={{
    width: 28,
    height: 28,
    borderRadius: "var(--radius-sm)",
    border:
      "1px solid var(--border-subtle)",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  }}
>
  🤖
</motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleRight}
        style={{
          width: 28,
          height: 28,
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border-subtle)",
          background: rightCollapsed ? "var(--accent-subtle)" : "transparent",
          color: rightCollapsed ? "var(--accent)" : "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
          transition: "all var(--transition-fast)",
        }}
        title="Toggle right sidebar"
      >
        {rightCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </motion.button>
    </motion.nav>
  );
};

export default Navbar;
