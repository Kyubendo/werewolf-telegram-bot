import TelegramBot from "node-telegram-bot-api";
import {State} from "../../Bot";

export const nextStage = (bot: TelegramBot, state: State) => {
    bot.onText(/\/test_next_stage/, () => {
        if (!state.game) return;
        state.game.setNextStage()
    })
}
