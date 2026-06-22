import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  publicDir: "public",
  build: {
    // Production source maps stay private unless an authenticated upload flow
    // is deliberately configured for a monitoring provider.
    sourcemap: false,
  },
});
