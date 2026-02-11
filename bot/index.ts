import "dotenv/config";
import { bot } from "@/bot/config/";
import { setupHandlers } from "@/bot/handlers/";
import { setupActions } from "@/bot/actions/";
import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/types";

async function initBot(bot: Telegraf<Context<Update>>) {
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
    console.log("🤖 Bot is listening...");
  } catch (error) {
    console.error("❌ Error al iniciar el bot:", error);
    process.exit(1);
  }
}

export default initBot;
