import TelegramBot from "node-telegram-bot-api";
import {roles} from "../../Utils/roleList";

export const roleList = (bot: TelegramBot,) => {
    bot.onText(/\/role_list/, msg => {
        console.log(1)
        if (!msg.from?.id) {
            return;
        }
        console.log(Object.keys(roles)
            .map(key => `${roles[key]().roleName} — /about_${key}`)
            .join('\n'))

        bot.sendMessage(msg.from.id,
            Object.keys(roles)
                .map(key => `${roles[key]().roleName} — /about_${key}`)
                .join('\n'))
    })
}
