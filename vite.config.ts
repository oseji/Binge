import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Firebase is most of the bundle and changes far less often than the app
        manualChunks: { firebase: ["firebase/app", "firebase/auth", "firebase/firestore"] },
      },
    },
  },
});
