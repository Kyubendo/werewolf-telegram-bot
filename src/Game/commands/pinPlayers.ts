import TelegramBot from "node-telegram-bot-api";
import {State} from "../../Bot";

export const pinPlayers = (bot: TelegramBot, state: State) => {
    bot.onText(/\/pin_players/, () => {
        if (!state.game || state.game.started) return
        if (!state.game.canPinPlayers) {
            bot.sendMessage(state.game.chatId, 'Суперпин можно использовать только один раз за игру.')
            return;
        }
        state.game.canPinPlayers = false
        bot.getChat(state.game.chatId)
            .then(async chat => {
                const names = chat.description?.split(/\s|\n/).filter(w => w.match(/^@/)) ?? []
                for (const name of names) {
                    await bot.sendMessage(chat.id, name, {parse_mode: undefined})
                }
            })
    })
}