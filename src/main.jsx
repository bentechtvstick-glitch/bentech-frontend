import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TVApp from "./TVApp.jsx";
import AdminApp from "./AdminApp.jsx";

// Simple path-based split: /admin loads the Admin Panel, everything else loads the TV app.
// Swap this for react-router-dom if you need more routes later.
function Root() {
  const isAdmin = window.location.pathname.startsWith("/admin");
  return isAdmin ? <AdminApp /> : <TVApp />;
}

createRoot(document.getElementById("root")).render(<Root />);
