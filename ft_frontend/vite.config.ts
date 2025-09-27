import { defineConfig } from "vite";
import fs from "fs";
import path from "path";


export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "../ft_backend/localhost-key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "../ft_backend/localhost.pem")),
    },
    port: 5173,
    host: "localhost",
  },
});