import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "snbl.deploy.tz",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
