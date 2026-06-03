import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.93 }}
      onClick={toggleTheme}
      style={{
        width: 32,
        height: 32,
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-subtle)",
        background: "var(--bg-card)",
        color: "var(--text-secondary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        transition: "border-color var(--transition-fast), background var(--transition-fast)",
      }}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Moon size={14} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Sun size={14} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;
