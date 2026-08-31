import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: the entire product is browser-only (IndexedDB persistence,
  // no server routes). Generates the deployable `out/` directory.
  output: "export",
  // Trailing slashes make every route a directory with index.html, so the
  // export works on any dumb static file server (and Vercel).
  trailingSlash: true,
  // No <Image> usage currently; kept explicit for safety.
  images: { unoptimized: true },
};

export default nextConfig;
