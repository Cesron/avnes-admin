import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Habilita el output standalone para generar server.js y reducir
  // drásticamente el tamaño de la imagen Docker.
  output: "standalone",
};

export default nextConfig;
