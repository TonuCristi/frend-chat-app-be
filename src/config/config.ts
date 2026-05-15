import "dotenv/config";

type Config = {
  port: number;
  nodeEnv: string;
  mongoUrl: string;
  apiBaseUrlProd: string;
  apiBaseUrlDev: string;
  jwtSecret: string;
};

const config: Config = {
  port: Number(process.env.PORT) || 8000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUrl: process.env.MONGODB_URL || "",
  apiBaseUrlProd: process.env.API_BASE_URL_PROD || "",
  apiBaseUrlDev: process.env.API_BASE_URL_DEV || "",
  jwtSecret: process.env.JWT_SECRET || "",
};

export default config;
