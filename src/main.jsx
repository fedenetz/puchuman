import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import RootErrorBoundary from "./components/RootErrorBoundary";
import { initializeErrorMonitoring } from "./lib/errorMonitoring";

const rootElement = document.getElementById("root");
rootElement.replaceChildren();

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>,
);

initializeErrorMonitoring();
