// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import App from "./App";

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <BrowserRouter>
//     <Routes>
//       <Route path="/room/:roomId" element={<App />} />
//     </Routes>
//   </BrowserRouter>
// );
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import "./globals.css";
import HomePage from "./pages/HomePage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route
  path="/"
  element={<HomePage />}
/>

<Route
  path="/room/:roomId"
  element={<App />}
/>
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);