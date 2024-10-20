import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import fs from "fs";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // Updates service worker automatically when there are changes
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"], // PWA assets
      manifest: {
        name: "Pump Royale",
        short_name: "PumpRoyale",
        description: "An engaging fitness tracking game!",
        theme_color: "#ffffff",
        icons: [
          {
            src: "logo-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: {
    https: {
      key: fs.readFileSync("./server.key"), // Path to your private key
      cert: fs.readFileSync("./server.cert"), // Path to your certificate
    },
    host: "0.0.0.0",
  },
});
