import TelegramBot from "node-telegram-bot-api";
import {State} from "../../Bot";

export const pinPlayers = (bot: TelegramBot, state: State) => {
    bot.onText(/\/pin_players/, msg => {
        if (msg.chat.type === 'private' || msg.chat.type === 'channel')
            bot.sendMessage(msg.chat.id, 'Суперпин можно использовать только в групповом чате.')
        else if (!state.game)
            bot.sendMessage(
                msg.chat.id,
                'Суперпин можно использовать только во время стадии ' +
                `подбора игроков. Воспользуйтесь командой /start_classic@${process.env.BOT_NAME}, чтобы начать игру.`,
                {
                    parse_mode: 'HTML'
                })
        else if (state.game.started)
            bot.sendMessage(state.game.chatId, 'Суперпин нельзя использовать после того, как игра началась.')
        else if (!state.game.canPinPlayers)
            bot.sendMessage(state.game.chatId, 'Суперпин уже был использован. ' +
                'Этой командой можно воспользоваться только один раз за стадию подбора игроков.')
        else {
            state.game.canPinPlayers = false
            bot.getChat(state.game.chatId)
                .then(async chat => {
                    const names = chat.description?.split(/\s|\n/).filter(w => w.match(/^@/)) ?? []
                    for (const name of names) {
                        if (!(await state.game?.players.map(p => p.username).includes(name.substring(1))))
                            await bot.sendMessage(chat.id, name, {parse_mode: undefined})
                    }
                })
        }
    })
}