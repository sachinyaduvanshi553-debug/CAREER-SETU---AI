/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: false, // Reduce memory usage during dev
    async rewrites() {
        // Only apply the local dev proxy when NEXT_PUBLIC_API_URL is NOT set
        // (i.e. running locally where Next.js proxies to localhost:8000)
        if (process.env.NEXT_PUBLIC_API_URL) {
            return []; // No rewrites needed on Render — frontend calls backend directly
        }
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/api/:path*',
            },
        ];
    },
};

export default nextConfig;
