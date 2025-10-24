import withPWA from "next-pwa";
const withPWAConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV !== "production",
});
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["react-icons", "@phosphor-icons/react", "lucide-react"],
  },
};
export default withPWAConfig(nextConfig);
