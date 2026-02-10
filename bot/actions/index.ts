import { bot } from "../config/index.js";
import downloadAction from "./download/index.js";

export const setupActions = () => {
  bot.action(/^info_(.+)$/, async (ctx) => {
    try {
      const trackId = ctx.match[1] as string;
      const keyboard = (
        ctx.callbackQuery.message as any
      ).reply_markup.inline_keyboard.flat();

      const findById = keyboard.find((btn: any) =>
        btn.callback_data.includes(trackId)
      );
      if (!findById) return await ctx.answerCbQuery("No se encontró el track.");

      const rawName = findById.text.replace(/^\d+\.\s*/, "").trim();
      const [artist, title] = rawName.includes("-")
        ? rawName.split("-")
        : ["Hardstyle", rawName];

      downloadAction(ctx, artist.trim(), title.trim());
    } catch (error) {
      console.error("Error en la acción info:", error);
      await ctx.reply("❌ Error al iniciar la descarga.");
    }
  });
};
