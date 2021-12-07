import TelegramBot from "node-telegram-bot-api";

export const deleteGroupchat = async (bot: TelegramBot) => {
    bot.onText(/\/delete_groupchat/, msg => {
        if (msg.chat.type === 'private' || msg.chat.type === 'channel') return;

        bot.sendMessage(msg.chat.id, 'Чат будет удалён через 3...');
        setTimeout(() => bot.sendMessage(msg.chat.id, '2...'), 1500)
        setTimeout(() => bot.sendMessage(msg.chat.id, '1...'), 1500)
        setTimeout(() => bot.sendMessage(msg.chat.id,
            `Игрок ${msg.from?.username} заблокирован за попытку удалить чат.`), 1500)
    })
}