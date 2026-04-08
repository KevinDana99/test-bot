import downloadService from "@/bot/services/music/download";
import type { SearchResultType } from "@/bot/services/music/search/types";

async function downloadAction(ctx: any, track: SearchResultType) {
  try {
    const audio = await downloadService(track, ctx);
    if (audio) {
      const description = `${audio.performer} - ${audio.title}`;
      await ctx.replyWithAudio(
        {
          url: audio.soundTrack,
          filename: `${description}.mp3`,
        },
        {
          ...(audio.durationTrack ? { duration: audio.durationTrack } : {}),
          title: audio.title,
          performer: audio.performer,
          caption: `✅ ¡Listo! <b>${description}</b>`,
          parse_mode: "HTML",
        }
      );
    } else {
      await ctx.reply("❌ El audio llegó vacío. Intenta de nuevo.");
    }
  } catch (err) {
    console.error("❌ Error en descarga de fondo:", err);
    await ctx.reply("❌ Hubo un error al descargar el archivo.");
  }
}

export default downloadAction;
