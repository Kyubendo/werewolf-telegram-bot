import TelegramBot from "node-telegram-bot-api";
import {join} from "../callbacks/join";
import {State} from "../../Bot";
import {roleChoice} from "../callbacks/roleChoice";

export const callbackHandle = (bot: TelegramBot, state: State) => {
    bot.on('callback_query', query => {
        const game = state.game
        if (!game) return;
        switch (query.data) {
            case 'join':
                join(game, query)
                break
            default:
                roleChoice(query, game.players)
                game.lynch?.handleVotingChoice(query)

        }
    })
}
