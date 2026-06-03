import React from "react";
import { Hash, Globe, Lock } from "lucide-react";

interface RoomInfoProps {
  roomId: string;
  isPublic?: boolean;
  createdAt?: Date;
}

const RoomInfo: React.FC<RoomInfoProps> = ({ roomId, isPublic = true }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "var(--radius-md)",
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        fontSize: "12px",
        color: "var(--text-secondary)",
        fontFamily: "var(--font-mono)",
      }}
    >
      <Hash size={12} color="var(--text-muted)" />
      <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {roomId}
      </span>
      {isPublic ? (
        <Globe size={11} color="var(--status-green)" />
      ) : (
        <Lock size={11} color="var(--status-yellow)" />
      )}
    </div>
  );
};

export default RoomInfo;
