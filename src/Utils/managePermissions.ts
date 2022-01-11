import TelegramBot from "node-telegram-bot-api";

export const silentPlayer = (chatId: number | string, playerId: string, bot: TelegramBot) => {
    bot.restrictChatMember(chatId, playerId, {
        can_send_messages: false,
        can_send_media_messages: false,
        can_send_polls: false,
        can_send_other_messages: false,
        can_add_web_page_previews: false,
        can_invite_users: false,
        can_pin_messages: false,
    })
}
export const unSilentPlayer = (chatId: number | string, playerId: string, bot: TelegramBot) => {
    bot.restrictChatMember(chatId, playerId, {
        can_send_messages: true,
        can_send_media_messages: true,
        can_send_polls: true,
        can_send_other_messages: true,
        can_add_web_page_previews: true,
        can_invite_users: true,
        can_pin_messages: true,
    })
}

