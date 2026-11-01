/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Site 100 % statique (dossier out/) : aucun serveur Next en production,
  // donc aucune surface d'attaque côté serveur.
  output: "export",
  trailingSlash: false,
  poweredByHeader: false,
};

export default nextConfig;
