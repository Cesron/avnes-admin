import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Habilita el output standalone para generar server.js y reducir
  // drásticamente el tamaño de la imagen Docker.
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/d/*",
        search: "",
      },
    ],
  },
};

export default nextConfig;
