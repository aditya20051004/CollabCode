import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Hash, Clock, Layers } from "lucide-react";
import OnlineUsers from "./OnlineUsers";

interface SidebarProps {
  users: Array<{ id: string; username: string }>;
  roomId: string;
  currentUsername: string;
  collapsed: boolean;
}

const SectionHeader: React.FC<{
  icon: React.ReactNode;
  label: string;
  count?: number;
}> = ({ icon, label, count }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "7px",
      padding: "14px 12px 8px",
    }}
  >
    <span style={{ color: "var(--text-muted)" }}>{icon}</span>
    <span
      style={{
        fontSize: "10px",
        fontWeight: 700,
        color: "var(--text-muted)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        flex: 1,
      }}
    >
      {label}
    </span>
    {count !== undefined && (
      <span
        style={{
          fontSize: "10px",
          fontWeight: 700,
          color: "var(--accent)",
          background: "var(--accent-subtle)",
          padding: "1px 6px",
          borderRadius: "var(--radius-full)",
        }}
      >
        {count}
      </span>
    )}
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({
  users,
  roomId,
  currentUsername,
  collapsed,
}) => {
  return (
    <AnimatePresence>
      {!collapsed && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "var(--sidebar-width)", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{
            height: "100%",
            background: "var(--bg-surface)",
            borderRight: "1px solid var(--border-subtle)",
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
              width: "var(--sidebar-width)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {/* Room Info Card */}
            <div
              style={{
                margin: "12px",
                padding: "12px",
                background: "var(--bg-card)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "var(--radius-sm)",
                    background: "var(--accent-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Layers size={14} color="var(--accent)" />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      fontWeight: 500,
                    }}
                  >
                    Room
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-mono)",
                      maxWidth: "150px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    #{roomId}
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: "flex", gap: "8px" }}>
                <div
                  style={{
                    flex: 1,
                    background: "var(--bg-surface)",
                    borderRadius: "var(--radius-sm)",
                    padding: "7px 10px",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "var(--accent)",
                    }}
                  >
                    {users.length}
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                    Online
                  </div>
                </div>
                <div
                  style={{
                    flex: 1,
                    background: "var(--bg-surface)",
                    borderRadius: "var(--radius-sm)",
                    padding: "7px 10px",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "var(--status-green)",
                    }}
                  >
                    Live
                  </div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                    Sync
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: "var(--border-subtle)",
                margin: "0 12px",
              }}
            />

            {/* Online Users */}
            <SectionHeader
              icon={<Users size={12} />}
              label="Members"
              count={users.length}
            />
            <div style={{ padding: "0 4px 8px" }}>
              <OnlineUsers users={users} currentUsername={currentUsername} />
            </div>
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};



export default Sidebar;
