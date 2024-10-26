/** @type {import('next').NextConfig} */
import path from 'path';

const nextConfig = {
	eslint: {
        ignoreDuringBuilds: true,
    },
    webpack: (config) => {
        config.resolve.alias['@'] = path.join(process.cwd(), 'src'); // Use process.cwd() for the current working directory
        return config;
    },
};

export default nextConfig;
