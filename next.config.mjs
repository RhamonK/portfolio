/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Site 100 % statique (dossier out/) : aucun serveur Next en production,
  // sans serveur Next exposé en production.
  output: "export",
  trailingSlash: false,
  poweredByHeader: false,
};

export default nextConfig;
