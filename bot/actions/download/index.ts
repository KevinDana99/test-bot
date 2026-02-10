import downloadService from "@/bot/services/music/download";

async function downloadAction(ctx: any, artist: string, title: string) {
  try {
    const audio = await downloadService(artist, title, ctx);
    if (audio) {
      const desctiption = `${artist} - ${title}`;
      await ctx.replyWithAudio(
        {
          url: audio.soundTrack,
          filename: `${desctiption}.mp3`,
        },
        {
          duration: audio.durationTrack,
          title: desctiption,
          performer: artist,
          caption: `✅ ¡Listo! <b>${artist} - ${title}</b>`,
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
