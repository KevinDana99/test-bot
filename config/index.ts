type ConfigEnvoirmentType = "production" | "development";
const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV;
const PRODUCTION = ENVIRONMENT === "production" ? true : false;
const CONFIG = {
  PORT,
  ACCESS_TOKEN_TELEGRAM_BOT: process.env.ACCESS_TOKEN_TELEGRAM_BOT,
  API_HOST: PRODUCTION
    ? `https://${process.env.FLY_APP_NAME}.fly.dev`
    : `http://localhost:${PORT}`,
};

export default CONFIG;
