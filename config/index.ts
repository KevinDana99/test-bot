type ConfigEnvoirmentType = "production" | "development";
const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV;
const PRODUCTION =
  (ENVIRONMENT as ConfigEnvoirmentType) === "production" ? true : false;
const config = {
  PORT,
  ACCESS_TOKEN_TELEGRAM_BOT: process.env.ACCESS_TOKEN_TELEGRAM_BOT,
  API_HOST: PRODUCTION
    ? `https://${process.env.FLY_APP_NAME}.fly.dev`
    : `http://localhost:${PORT}`,
  RAPID_API_HOST: process.env.RAPID_API_HOST,
  RAPID_API_SECRET_KEY: process.env.RAPID_API_SECRET_KEY,
};

export default config;
