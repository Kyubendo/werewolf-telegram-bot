import TelegramBot from "node-telegram-bot-api";
import {villagers} from "../../Utils/teams";
import {Player} from "../../Player/Player";
import {RoleBase} from "../../Roles";

export const roleList = (bot: TelegramBot) => {
    bot.onText(/\/role_list/, (msg) => {
        // state.game?.chatId && bot
        //     .sendMessage(state.game?.chatId, 'Список ролей:\n')

        if (msg.from) {
            const player = new Player(msg.from);
            let villagersList: string[] = []
            for (const villager in villagers) {
                const newVillager = new (villager.constructor as any)(player);
                newVillager.role = newVillager.createThisRole(player);
                newVillager instanceof RoleBase && newVillager.player.role?.roleName && villagersList
                    .push(newVillager.player.role?.roleName);
                //console.log(newVillager.player.role?.roleName)
            }
            bot.sendMessage(
                msg.chat.id,
                `Селяни 👩🏻‍🌾:\n${villagersList.join('\n')}`
            )

            bot.sendMessage(
                msg.chat.id,
                'Команда волков 🐾:\n'
            )
        }
    })
}
