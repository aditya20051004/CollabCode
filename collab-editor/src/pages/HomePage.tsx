import React, { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, LogIn, Lock, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  
  const [createRoom, setCreateRoom] = useState({

    roomName: "",
    password: "",
  });
  const navigate = useNavigate();

  const [joinRoom, setJoinRoom] = useState({
    roomName: "",
    password: "",
  });

  const handleCreateRoom = () => {

    if (

      !createRoom.roomName.trim() ||

      !createRoom.password.trim()

    ) {

      alert("Enter room name and password");

      return;

    }

    localStorage.setItem(

      `room_${createRoom.roomName}`,

      createRoom.password

    );

    navigate(

      `/room/${createRoom.roomName}`

    );

  };

  const handleJoinRoom = () => {

    const savedPassword =

      localStorage.getItem(

        `room_${joinRoom.roomName}`

      );

    if (!savedPassword) {

      alert("Room not found");

      return;

    }

    if (

      savedPassword !==

      joinRoom.password

    ) {

      alert("Wrong password");

      return;

    }

    navigate(

      `/room/${joinRoom.roomName}`

    );

  };

  return (
    <div
      style={{
        "--bg": "var(--bg-color, #0a0a0a)",
        "--card": "var(--card-color, rgba(255,255,255,0.08))",
        "--border": "var(--border-color, rgba(255,255,255,0.12))",
        "--text": "var(--text-color, #ffffff)",
        "--muted": "var(--muted-color, #a1a1aa)",
        "--primary": "var(--primary-color, #7c3aed)",
        minHeight: "100vh",
        width: "100%",
        background:
          "radial-gradient(circle at top left, rgba(124,58,237,0.18), transparent 30%), radial-gradient(circle at bottom right, rgba(59,130,246,0.18), transparent 30%), var(--bg)",
        color: "var(--text)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        boxSizing: "border-box",
        overflow: "hidden",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      } as React.CSSProperties}
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          textAlign: "center",
          marginBottom: "60px",
          maxWidth: "800px",
        }}
      >
        <motion.h1
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: 800,
            margin: 0,
            background:
              "linear-gradient(135deg, #ffffff, #c4b5fd, #60a5fa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-2px",
          }}
        >
          CollabCode
        </motion.h1>

        <p
          style={{
            marginTop: "18px",
            fontSize: "1.2rem",
            color: "var(--muted)",
            lineHeight: 1.7,
          }}
        >
          Real-time collaborative coding, notes, chat, and execution.
        </p>
      </motion.div>

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 420px))",
          gap: "28px",
          width: "100%",
          maxWidth: "950px",
        }}
      >
        {/* Create Room */}
        <motion.div
          whileHover={{
            y: -6,
            scale: 1.02,
          }}
          transition={{ duration: 0.25 }}
          style={{
            background: "var(--card)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid var(--border)",
            borderRadius: "28px",
            padding: "28px",
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "24px",
            }}
          >
            <PlusCircle size={24} />
            <h2
              style={{
                margin: 0,
                fontSize: "1.4rem",
                fontWeight: 700,
              }}
            >
              Create Room
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "14px",
              }}
            >
              <Hash size={18} />
              <input
                value={createRoom.roomName}
                onChange={(e) =>
                  setCreateRoom({
                    ...createRoom,
                    roomName: e.target.value,
                  })
                }
                placeholder="Room Name"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text)",
                  fontSize: "15px",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "14px",
              }}
            >
              <Lock size={18} />
              <input
                type="password"
                value={createRoom.password}
                onChange={(e) =>
                  setCreateRoom({
                    ...createRoom,
                    password: e.target.value,
                  })
                }
                placeholder="Password"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text)",
                  fontSize: "15px",
                }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCreateRoom}
              style={{
                marginTop: "8px",
                border: "none",
                cursor: "pointer",
                padding: "14px",
                borderRadius: "16px",
                fontWeight: 700,
                fontSize: "15px",
                color: "#fff",
                background:
                  "linear-gradient(135deg, #7c3aed, #3b82f6)",
                boxShadow:
                  "0 10px 25px rgba(124,58,237,0.35)",
              }}
            >
              Create Room
            </motion.button>
          </div>
        </motion.div>

        {/* Join Room */}
        <motion.div
          whileHover={{
            y: -6,
            scale: 1.02,
          }}
          transition={{ duration: 0.25 }}
          style={{
            background: "var(--card)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid var(--border)",
            borderRadius: "28px",
            padding: "28px",
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "24px",
            }}
          >
            <LogIn size={24} />
            <h2
              style={{
                margin: 0,
                fontSize: "1.4rem",
                fontWeight: 700,
              }}
            >
              Join Room
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "14px",
              }}
            >
              <Hash size={18} />
              <input
                value={joinRoom.roomName}
                onChange={(e) =>
                  setJoinRoom({
                    ...joinRoom,
                    roomName: e.target.value,
                  })
                }
                placeholder="Room Name"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text)",
                  fontSize: "15px",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "14px",
              }}
            >
              <Lock size={18} />
              <input
                type="password"
                value={joinRoom.password}
                onChange={(e) =>
                  setJoinRoom({
                    ...joinRoom,
                    password: e.target.value,
                  })
                }
                placeholder="Password"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text)",
                  fontSize: "15px",
                }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleJoinRoom}
              style={{
                marginTop: "8px",
                border: "none",
                cursor: "pointer",
                padding: "14px",
                borderRadius: "16px",
                fontWeight: 700,
                fontSize: "15px",
                color: "#fff",
                background:
                  "linear-gradient(135deg, #3b82f6, #06b6d4)",
                boxShadow:
                  "0 10px 25px rgba(59,130,246,0.35)",
              }}
            >
              Join Room
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;