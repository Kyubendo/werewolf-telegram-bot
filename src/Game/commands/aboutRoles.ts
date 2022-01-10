import TelegramBot from "node-telegram-bot-api";
import {roles} from "../../Utils/roleList";

export const aboutRoles = (bot: TelegramBot,) => {
    bot.onText(/\/about_(.+)/, (msg, match) => {
        if (!msg.from?.id) return;
        const roleKey = match?.[1]
        if (!roleKey || !roles.hasOwnProperty(roleKey)) return
        const role = roles[roleKey]()
        const roleInfo = `*${role.roleName}\n*`
            + `*Вес:* ${role.weight}\n`
            + `*Команда:* ${role.team ?? 'Нет команды'}\n`
            + (role.winCondition ? `*Побеждает, если* ${role.winCondition}.` : `*Всегда проигрывает.*`) + '\n'
            + (role.dayAction ? `Дневное действие: ${role.dayAction}\n` : '')
            + (role.nightAction ? `Ночное действие: ${role.nightAction}\n` : '')
            + (role.notes ? '*Примечания:*\n' + role.notes?.map(n => `\t\t — _${n}_`).join('\n') : '')

        bot.sendMessage(msg.from.id, roleInfo)
    })
}