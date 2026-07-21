import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { SubjectProvider } from "./context/SubjectContext";

import "./Styles/Light.css";
import "./Styles/Dark.css";

import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SubjectProvider>
      <App />
      <Analytics />
      <SpeedInsights />
    </SubjectProvider>
  </React.StrictMode>
);