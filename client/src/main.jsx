import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThirdwebProvider } from "thirdweb/react";

createRoot(document.getElementById("root")).render(
  <ThirdwebProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </ThirdwebProvider>
);

if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered:", registration);
      })
      .catch((error) => {
        console.log("SW registration failed:", error);
      });
  });
}
