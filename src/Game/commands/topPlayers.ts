import TelegramBot from "node-telegram-bot-api";

export const topPlayers = (bot: TelegramBot) => {
    bot.onText(/\/top_players/, msg => {
        if (msg.chat.type === 'channel' || msg.chat.type === 'private' || !msg.from) return;

        bot.sendMessage(
            msg.chat.id,
            'test'
        )
    })
}