import TelegramBot from "node-telegram-bot-api";
import {State} from "../../Bot";
import {User} from "../../entity/User";
import {UserChat} from "../../entity/UserChat";
import {joinButton} from "./startGame";

export const notify = (bot: TelegramBot, state: State) => {
    bot.onText(/\/notify/, async msg => {
        if (msg.chat.type === 'private' || msg.chat.type === 'channel')
            bot.sendMessage(msg.chat.id, 'Нотифай можно использовать только в групповом чате.')
        else if (!state.game)
            bot.sendMessage(
                msg.chat.id,
                'Нотифай можно использовать только во время стадии ' +
                `подбора игроков. Воспользуйтесь командой /start_classic@${process.env.BOT_NAME}, чтобы начать игру.`,
                {
                    parse_mode: undefined
                })
        else if (state.game.started)
            bot.sendMessage(state.game.chatId, 'Нотифай нельзя использовать после того, как игра началась.')
        else if (!state.game.canNotifyPlayers)
            bot.sendMessage(state.game.chatId, 'Нотифай уже был использован. ' +
                'Этой командой можно воспользоваться только один раз за стадию подбора игроков.')
        else {
            state.game.canNotifyPlayers = false
            const users = await User.createQueryBuilder('u')
                .innerJoin(UserChat, 'uc', 'uc.userId = u.id')
                .andWhere('uc.chatId = :chatId', {chatId: msg.chat.id})
                .getMany()
            users.filter(u => !state.game?.players.map(p => p.id).includes(u.id))
                .forEach(u => bot.sendMessage(
                    u.id,
                    `В чате ${msg.chat.title} собирают игру! Нажми чтобы присоединиться.`,
                    {
                        reply_markup: joinButton
                    }))
        }
    })
}