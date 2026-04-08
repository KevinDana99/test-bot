import { bot } from "../config/";
import { getCachedTrack } from "../services/music/search";
import downloadAction from "./download/";

export const setupActions = () => {
  bot.action(/^info_(.+)$/, async (ctx) => {
    try {
      const trackId = ctx.match[1] as string;
      const track = getCachedTrack(trackId);

      if (!track) {
        return await ctx.answerCbQuery("El resultado venció. Buscá de nuevo.");
      }

      await ctx.answerCbQuery(`Preparando ${track.title}`);
      await downloadAction(ctx, track);
    } catch (error) {
      console.error("Error en la acción info:", error);
      await ctx.reply("❌ Error al iniciar la descarga.");
    }
  });
};
