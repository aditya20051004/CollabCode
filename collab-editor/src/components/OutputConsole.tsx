import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, ChevronDown, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface OutputConsoleProps {
  output: string;
  isRunning: boolean;
  onClear: () => void;
  height: number;
}

const OutputConsole: React.FC<OutputConsoleProps> = ({
  output,
  isRunning,
  onClear,
  height,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  const hasError = output.toLowerCase().includes("error") || output.toLowerCase().includes("traceback");
  const hasSuccess = output && !hasError && !isRunning;

  const statusColor = hasError
    ? "var(--status-red)"
    : hasSuccess
    ? "var(--status-green)"
    : "var(--text-muted)";

  const StatusIcon = hasError ? XCircle : hasSuccess ? CheckCircle : Terminal;

  return (
    <div
      style={{
        height,
        background: "var(--bg-base)",
        borderTop: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Console Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "36px",
          padding: "0 14px",
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border-subtle)",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        {/* Traffic lights style dots */}
        <div style={{ display: "flex", gap: "5px" }}>
          {["#EF4444", "#F59E0B", "#10B981"].map((c, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: c,
                opacity: 0.7,
              }}
            />
          ))}
        </div>

        <Terminal size={12} color={statusColor} />
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "var(--text-muted)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            flex: 1,
          }}
        >
          Console
        </span>

        {/* Status Badge */}
        <AnimatePresence>
          {isRunning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "2px 8px",
                borderRadius: "var(--radius-full)",
                background: "rgba(245, 158, 11, 0.15)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
              }}
            >
              <motion.div
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--status-yellow)",
                }}
              />
              <span style={{ fontSize: "10px", color: "var(--status-yellow)", fontWeight: 600 }}>
                Executing
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clear Button */}
        {output && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClear}
            style={{
              width: 22,
              height: 22,
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-subtle)",
              background: "transparent",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all var(--transition-fast)",
            }}
            title="Clear output"
          >
            <X size={11} />
          </motion.button>
        )}
      </div>

      {/* Output Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "auto",
          padding: "12px 16px",
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          lineHeight: "1.7",
          color: hasError ? "var(--status-red)" : "var(--text-secondary)",
        }}
      >
        {!output && !isRunning ? (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              gap: "8px",
              fontSize: "12px",
            }}
          >
            <Terminal size={16} strokeWidth={1.5} />
            <span>Run your code to see output here</span>
          </div>
        ) : (
          <AnimatePresence>
            <motion.pre
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                margin: 0,
              }}
            >
              {output || ""}
            </motion.pre>
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default OutputConsole;
