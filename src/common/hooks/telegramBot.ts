interface TelegramBot {
  WebApp: any
}
interface TelegramWindow extends Window {
  Telegram?: TelegramBot
}
declare const window: TelegramWindow

export const telegram = window.Telegram?.WebApp
