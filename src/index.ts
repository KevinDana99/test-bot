import "dotenv/config";
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start((ctx) => ctx.reply("¡Hola! El bot está vivo en Vercel 🚀"));
bot.help((ctx) => ctx.reply("Mandame cualquier cosa y te la repito."));

bot.on("text", (ctx) => {
  ctx.reply(`Me dijiste: ${ctx.message.text}`);
});

export default async (req: any, res: any) => {
  if (req.method === "POST") {
    await bot.handleUpdate(req.body, res);
  } else {
    res.status(200).send("Bot funcionando!");
  }
};
