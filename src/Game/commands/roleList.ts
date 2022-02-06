import TelegramBot from "node-telegram-bot-api";
import {roles} from "../../Utils/roleList";
import {specialEscape} from "../../Utils/stringEscape";

export const roleList = (bot: TelegramBot,) => {
    bot.onText(/\/role_list/, msg => {
        if (!msg.from?.id) {
            return;
        }
        const sortedRolesText = '__*👨‍🌾 Команда селян 👩‍🌾*__:\n' + mapRoles('Селяне') +
            '\n__*🦉 Команда волков 🐺*__:\n' + mapRoles('Волки') +
            '\n__*👹 Другие роли 🤡*__:\n' + mapRoles(undefined)
            + mapRoles('Поджигатели')
            + mapRoles('Сам в команде')
        bot.sendMessage(msg.from.id, sortedRolesText)
    })
}

const mapRoles = (team: string | undefined):string => Object.keys(roles)
    .filter(key => roles[key]().team === team)
    .sort((keyA, keyB) => +(roles[keyA]().roleName.localeCompare(roles[keyB]().roleName)))
    .map(key => `*${roles[key]().roleName}* — ${specialEscape(`/about_${key}`)}`)
    .join('\n') + '\n'
