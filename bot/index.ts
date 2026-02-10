import "dotenv/config";
import { bot } from "@/bot/config/index.js";
import { setupHandlers } from "@/bot/handlers/index.js";
import { setupActions } from "@/bot/actions/index.js";

async function initBot() {
  try {
    setupHandlers();
    console.log("📝 Handlers registrados");
    setupActions();
    console.log("🔘 Actions registradas");

    await bot.telegram.setMyCommands([
      { command: "start", description: "🚀 Iniciar el bot" },
      { command: "help", description: "📖 Guía de uso" },
      { command: "about", description: "ℹ️ Sobre este proyecto" },
    ]);
    await bot.launch();
    console.log("🚀 ¡Bot de Música Online y escuchando!");
  } catch (error) {
    console.error("❌ Error al iniciar el bot:", error);
    process.exit(1);
  }
}

initBot();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
