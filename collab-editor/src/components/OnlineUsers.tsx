import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Circle } from "lucide-react";

interface User {
  id: string;
  username: string;
  socketId?: string;
}

interface OnlineUsersProps {
  users: User[];
  currentUsername: string;
}

// Generate a stable color from a string
const getAvatarColor = (name: string): string => {
  const colors = [
    "#6366F1", "#8B5CF6", "#EC4899", "#EF4444",
    "#F59E0B", "#10B981", "#3B82F6", "#06B6D4",
    "#84CC16", "#F97316",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name: string): string => {
  return name
    .split(/[\s_-]/)
    .map((p) => p[0]?.toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join("");
};

const UserAvatar: React.FC<{ username: string; size?: number }> = ({
  username,
  size = 32,
}) => {
  const color = getAvatarColor(username);
  const initials = getInitials(username);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${color}CC, ${color})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size < 30 ? "10px" : "12px",
        fontWeight: 700,
        color: "#fff",
        flexShrink: 0,
        letterSpacing: "0.02em",
        boxShadow: `0 2px 8px ${color}40`,
        border: "2px solid var(--bg-surface)",
      }}
    >
      {initials || "?"}
    </div>
  );
};

const OnlineUsers: React.FC<OnlineUsersProps> = ({ users, currentUsername }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <AnimatePresence>
        {users.map((user, index) => {
          const isYou = user.username === currentUsername;
          const color = getAvatarColor(user.username);

          return (
            <motion.div
              key={user.id || user.username}
              initial={{ opacity: 0, x: -16, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -16, scale: 0.95 }}
              transition={{
                duration: 0.25,
                delay: index * 0.04,
                ease: [0.4, 0, 0.2, 1],
              }}
              whileHover={{ x: 3 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "7px 10px",
                borderRadius: "var(--radius-md)",
                cursor: "default",
                transition: "background var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--bg-card-hover)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              {/* Avatar with online indicator */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <UserAvatar username={user.username} size={30} />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    bottom: -1,
                    right: -1,
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: "var(--status-green)",
                    border: "2px solid var(--bg-surface)",
                  }}
                />
              </div>

              {/* Username */}
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: isYou ? 600 : 500,
                      color: isYou ? "var(--accent)" : "var(--text-primary)",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user.username}
                  </span>
                  {isYou && (
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        color: "var(--accent)",
                        background: "var(--accent-subtle)",
                        padding: "1px 5px",
                        borderRadius: "var(--radius-full)",
                        letterSpacing: "0.05em",
                        flexShrink: 0,
                      }}
                    >
                      YOU
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    marginTop: "1px",
                  }}
                >
                  Online
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {users.length === 0 && (
        <div
          style={{
            padding: "20px 10px",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "12px",
          }}
        >
          No users online
        </div>
      )}
    </div>
  );
};

export { UserAvatar, getAvatarColor, getInitials };
export default OnlineUsers;
