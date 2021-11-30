import TelegramBot from "node-telegram-bot-api";
import {State} from "../../Bot";

export const nextStage = (bot: TelegramBot, state: State) => {
    bot.onText(/\/test_next_stage/, msg => {
        if (state.game && JSON.parse(process.env.ADMINS_ID!).includes(msg.from?.id)) state.game.setNextStage()
    })
}
