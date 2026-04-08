import { Markup } from 'telegraf'
import { groupTracksBySong, search } from '@/bot/services/music/search/'
import { bot } from '@/bot/config'
import { aboutCommand, helpCommand, startCommand } from '../commands'
import { GroupedSearchResultType } from './types'

function buildMixButtons(group: GroupedSearchResultType) {
  const buttons = []

  if (group.original) {
    buttons.push(
      Markup.button.callback('Original Mix', `info_${group.original.id}`)
    )
  }

  if (group.extended) {
    buttons.push(
      Markup.button.callback('Extended Mix', `info_${group.extended.id}`)
    )
  }

  if (group.radio) {
    buttons.push(Markup.button.callback('Radio Edit', `info_${group.radio.id}`))
  }

  return buttons
}

export const setupHandlers = () => {
  bot.start(startCommand)
  bot.help(helpCommand)
  bot.command('about', aboutCommand)
  bot.on('text', async (ctx) => {
    const message = ctx.message.text
    if (message.startsWith('/')) {
      return ctx.reply(
        '❌ Ese comando no existe. Escribí /help para ver qué puedo hacer.'
      )
    }
    await ctx.reply(`🔎 Buscando música relacionada con: "${message}"...`)

    try {
      const results = await search(message)
      const groups = groupTracksBySong(results)

      if (groups.length === 0) {
        await ctx.reply('❌ No se encontro ningun resultado para tu busqueda')
        return
      }

      await ctx.reply('estos son tus resultados de busqueda:')

      for (const group of groups) {
        const buttons = buildMixButtons(group)

        if (buttons.length === 0) {
          continue
        }

        await ctx.reply(
          `🎵 ${group.artist} - ${group.title}`,
          Markup.inlineKeyboard([buttons])
        )
      }
    } catch (err) {
      await ctx.reply(`${err}`)
    }
  })
}
