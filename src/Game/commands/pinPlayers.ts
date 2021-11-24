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
            .then(chat => chat.description?.split(/\s|\n/).forEach(w => w.match(/^@/)
                && bot.sendMessage(chat.id, w, {parse_mode: undefined})))
    })
}