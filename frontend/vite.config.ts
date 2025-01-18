import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, mkdirSync, existsSync } from "fs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-manifest",
      closeBundle() {
        // Create dist directory if it doesn't exist
        if (!existsSync("dist")) {
          mkdirSync("dist", { recursive: true });
        }
        copyFileSync("manifest.json", "dist/manifest.json");
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        "content-script": resolve(
          __dirname,
          "src/scripts/content/content-script.js"
        ),
        background: resolve(__dirname, "src/scripts/background/background.js"),
        popup: resolve(__dirname, "index.html"),
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
