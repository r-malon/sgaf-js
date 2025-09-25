import type { NextConfig } from "next"

const inProduction: boolean = process.env.NODE_ENV === "production"

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:slug*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  },
  eslint: { ignoreDuringBuilds: inProduction },
  typescript: { ignoreBuildErrors: inProduction }
}

export default nextConfig
