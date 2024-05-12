const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')

const bot = new Telegraf('6898847491:AAEkUXQqQ92c5WSYNwVazAUq_JLlE9uibQA')
const weblink = 'https://monkey-clicker-kohl.vercel.app/'
bot.start((ctx) =>
  ctx.reply('Welcome', {
    reply_markup: {
      keyboard: [[{ text: 'Tab to play', web_app: { url: weblink } }]],
    },
  }),
)

bot.launch()
// bot.help((ctx: any) => ctx.reply('Send me a sticker'))
// bot.on(message('sticker'), (ctx: any) => ctx.reply('👍'))
// bot.hears('hi', (ctx: any) => ctx.reply('Hey there'))
