import { bot } from "../config/";
import { getCachedTrack } from "../services/music/search";
import downloadAction from "./download/";

async function safeAnswerCallback(ctx: any, text?: string) {
  try {
    await ctx.answerCbQuery(text);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("query is too old and response timeout expired")
    ) {
      console.warn("Callback query vencida, se ignora answerCbQuery");
      return;
    }

    if (
      error instanceof Error &&
      error.message.includes("query ID is invalid")
    ) {
      console.warn("Callback query invalida, se ignora answerCbQuery");
      return;
    }

    throw error;
  }
}

export const setupActions = () => {
  bot.action(/^info_(.+)$/, async (ctx) => {
    try {
      const trackId = ctx.match[1] as string;
      const track = getCachedTrack(trackId);

      if (!track) {
        await safeAnswerCallback(ctx, "El resultado venció. Buscá de nuevo.");
        return;
      }

      await safeAnswerCallback(ctx, `Preparando ${track.title}`);
      await downloadAction(ctx, track);
    } catch (error) {
      console.error("Error en la acción info:", error);
      await ctx.reply("❌ Error al iniciar la descarga.");
    }
  });
};
