import TelegramBot from "node-telegram-bot-api";
import {basicEscape} from "./Utils/stringEscape";

export class TgBot extends TelegramBot {
    sendMessage(chatId: TelegramBot.ChatId, text: string, options?: TelegramBot.SendMessageOptions): Promise<TelegramBot.Message> {
        return super.sendMessage(chatId, basicEscape(text), {parse_mode: 'MarkdownV2', ...options});
    }

    editMessageText(text: string, options?: TelegramBot.EditMessageTextOptions): Promise<TelegramBot.Message | boolean> {
        return super.editMessageText(basicEscape(text), {parse_mode: 'MarkdownV2', ...options});
    }

    sendAnimation(chatId: TelegramBot.ChatId, animation: string, options?: TelegramBot.SendAnimationOptions): Promise<TelegramBot.Message> {
        const caption = options?.caption ? basicEscape(options.caption) : undefined;
        return super.sendAnimation(chatId, animation, {parse_mode: 'MarkdownV2', ...options, caption});
    }
}