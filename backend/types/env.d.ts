declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    PORT?: string;
    CLIENT_URL: string;

    JWT_SECRET: string;

    MONGO_URI: string;
    ATLAS_URI: string;

    R2_ENDPOINT: string;
    R2_ACCESS_KEY: string;
    R2_SECRET_KEY: string;
    R2_PUBLIC_URL: string;
    R2_BUCKET: string;
  }
}
