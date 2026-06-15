/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "resvor-s3-bucket.s3.amazonaws.com",    


              
      },
    ],
  },
  async rewrites() {
    return { 

      beforeFiles: [
        {
          source: "/api/:path*",
          destination: "https://api-dev.resvor.com/:path*",
        },
      ],
    };
  },
};
 
export default nextConfig; 