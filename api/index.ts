import "dotenv/config";
import { Markup, Telegraf } from "telegraf";
import MusicService from "./services/music/index.js";

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start((ctx) => ctx.reply("¡Hola! El bot está vivo en Vercel 🚀"));
bot.help((ctx) => ctx.reply("Mandame cualquier cosa y te la repito."));

bot.on("text", async (ctx) => {
  const query = ctx.message.text;
  try {
    await ctx.reply(`Buscando ${query}`);
    const results = (await MusicService.search(query)) as Array<{
      title: string;
      artist: string;
      id: string;
    }>;

    if (!results || results.length === 0) {
      return await ctx.reply(
        `No pudimos obtener un resultado para tu busqueda de ${query} se obtuvieron estos resultados ${results}`,
      );
    }

    const buttons = results?.map((result) => [
      Markup.button.callback(
        `🎵 ${result.title} - ${result.artist}`,
        `info_${result.id}`,
      ),
    ]);
    await ctx.reply(
      "estos son tus resultados de busqueda:",
      Markup.inlineKeyboard(buttons),
    );
  } catch (err) {
    console.error(err);
  }
});

export default async (req: any, res: any) => {
  if (req.method === "POST") {
    await bot.handleUpdate(req.body, res);
  } else {
    res.status(200).send("Bot funcionando!");
  }
};
