import TelegramBot from "node-telegram-bot-api";
import {State} from "../../Bot";

export const nextStage = (bot: TelegramBot, state: State) => {
    bot.onText(/\/test_next_stage/, msg => {
        if (!state.game || !(msg.from?.id === 305891812)) return;
        state.game.setNextStage()
    })
}
