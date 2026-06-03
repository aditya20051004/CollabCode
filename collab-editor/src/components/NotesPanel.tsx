import React from "react";
import { motion } from "framer-motion";
import { StickyNote, Users } from "lucide-react";

interface NotesPanelProps {
  notes: string;
  onChange: (value: string) => void;
  height: number;
  activeUsers?: number;
}

const NotesPanel: React.FC<NotesPanelProps> = ({
  notes,
  onChange,
  height,
  activeUsers = 0,
}) => {
  return (
    <div
      style={{
        height,
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-subtle)",
        borderLeft: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Notes Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "36px",
          padding: "0 14px",
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border-subtle)",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <StickyNote size={12} color="var(--status-yellow)" />
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
          Shared Notes
        </span>
        {activeUsers > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "10px",
              color: "var(--status-green)",
            }}
          >
            <Users size={10} />
            <span>{activeUsers} editing</span>
          </div>
        )}
      </div>

      {/* Notes Textarea */}
      <textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Shared notes — visible to everyone in the room..."
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          resize: "none",
          padding: "12px 16px",
          fontFamily: "var(--font-sans)",
          fontSize: "13px",
          lineHeight: "1.7",
          color: "var(--text-primary)",
          width: "100%",
        }}
      />
    </div>
  );
};

export default NotesPanel;
