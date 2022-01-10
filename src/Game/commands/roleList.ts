import TelegramBot from "node-telegram-bot-api";
import {roles} from "../../Utils/roleList";
import {specialEscape} from "../../Utils/stringEscape";

export const roleList = (bot: TelegramBot,) => {
    bot.onText(/\/role_list/, msg => {
        if (!msg.from?.id) {
            return;
        }
        bot.sendMessage(msg.from.id,
            Object.keys(roles)
                .map(key => `*${roles[key]().roleName}* — ${specialEscape(`/about_${key}`)}`)
                .join('\n'))
    })
}
