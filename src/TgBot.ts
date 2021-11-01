import TelegramBot from "node-telegram-bot-api";

export class TgBot extends TelegramBot {
    sendMessage(chatId: TelegramBot.ChatId, text: string, options?: TelegramBot.SendMessageOptions): Promise<TelegramBot.Message> {
        return super.sendMessage(chatId, text, {parse_mode: 'Markdown', ...options});
    }
    editMessageText(text: string, options?: TelegramBot.EditMessageTextOptions): Promise<TelegramBot.Message | boolean> {
        return super.editMessageText(text, {parse_mode: 'Markdown', ...options});
    }
    sendAnimation(chatId: TelegramBot.ChatId, animation: string, options?: TelegramBot.SendAnimationOptions): Promise<TelegramBot.Message> {
        return super.sendAnimation(chatId, animation, {parse_mode: 'Markdown', ...options});
    }
}