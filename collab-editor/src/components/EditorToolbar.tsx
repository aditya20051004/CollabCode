import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Square,
  ChevronDown,
  FileCode,
  Loader,
  Zap,
} from "lucide-react";

interface EditorToolbarProps {
  language: string;
  isRunning: boolean;
  onRun: () => void;
  onLanguageChange?: (lang: string) => void;
  filename?: string;
}

const LANGUAGES = [
  { id: "python", label: "Python", ext: ".py" },
  { id: "javascript", label: "JavaScript", ext: ".js" },
  { id: "typescript", label: "TypeScript", ext: ".ts" },
  { id: "html", label: "HTML", ext: ".html" },
  { id: "css", label: "CSS", ext: ".css" },
  { id: "json", label: "JSON", ext: ".json" },
];

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  language,
  isRunning,
  onRun,
  onLanguageChange,
  filename = "main",
}) => {
  const [langOpen, setLangOpen] = React.useState(false);
  const currentLang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "40px",
        padding: "0 12px",
        background: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-subtle)",
        gap: "8px",
        flexShrink: 0,
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* File Tab */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 12px",
          borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
          background: "var(--bg-base)",
          border: "1px solid var(--border-subtle)",
          borderBottom: "1px solid var(--bg-base)",
          fontSize: "12px",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-mono)",
          marginBottom: "-1px",
        }}
      >
        <FileCode size={12} color="var(--accent)" />
        {filename}
        {currentLang.ext}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Language Selector */}
      <div style={{ position: "relative" }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setLangOpen((o) => !o)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 10px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-card)",
            color: "var(--text-secondary)",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all var(--transition-fast)",
          }}
        >
          <Zap size={11} color="var(--accent)" />
          {currentLang.label}
          <ChevronDown
            size={11}
            style={{
              transform: langOpen ? "rotate(180deg)" : "rotate(0)",
              transition: "transform var(--transition-fast)",
            }}
          />
        </motion.button>

        <AnimatePresence>
          {langOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "4px",
                minWidth: "140px",
                zIndex: 100,
                boxShadow: "var(--shadow-md)",
              }}
            >
              {LANGUAGES.map((lang) => (
                <motion.button
                  key={lang.id}
                  whileHover={{ x: 2 }}
                  onClick={() => {
                    onLanguageChange?.(lang.id);
                    setLangOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%",
                    padding: "6px 10px",
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    background:
                      lang.id === language ? "var(--accent-subtle)" : "transparent",
                    color:
                      lang.id === language
                        ? "var(--accent)"
                        : "var(--text-secondary)",
                    fontSize: "12px",
                    fontWeight: lang.id === language ? 600 : 400,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      color: "var(--text-muted)",
                      minWidth: "24px",
                    }}
                  >
                    {lang.ext}
                  </span>
                  {lang.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Run Button */}
      <motion.button
        whileHover={{ scale: isRunning ? 1 : 1.04 }}
        whileTap={{ scale: isRunning ? 1 : 0.96 }}
        onClick={!isRunning ? onRun : undefined}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "5px 14px",
          borderRadius: "var(--radius-sm)",
          border: "none",
          background: isRunning
            ? "rgba(239, 68, 68, 0.15)"
            : "linear-gradient(135deg, var(--accent), #8B5CF6)",
          color: isRunning ? "var(--status-red)" : "#fff",
          fontSize: "12px",
          fontWeight: 600,
          cursor: isRunning ? "not-allowed" : "pointer",
          boxShadow: isRunning ? "none" : "var(--shadow-accent)",
          transition: "all var(--transition-fast)",
          letterSpacing: "0.01em",
        }}
      >
        <AnimatePresence mode="wait">
          {isRunning ? (
            <motion.span
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader size={11} />
              </motion.div>
              Running
            </motion.span>
          ) : (
            <motion.span
              key="run"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <Play size={11} fill="currentColor" />
              Run
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default EditorToolbar;
