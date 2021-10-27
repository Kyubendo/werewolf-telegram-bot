import TelegramBot from "node-telegram-bot-api";
import {join} from "../callbacks/join";
import {State} from "../../Bot";
import {roleChoice} from "../callbacks/roleChoice";

export const callbackHandle = (bot: TelegramBot, state: State) => {
    bot.on('callback_query', query => {
        const game = state.game
        if (!game || !query.data) return;
        const select = JSON.parse(query.data)
        switch (select.type) {
            case 'join':
                join(game, select.choice)
                break
            case 'role':
                roleChoice(select.choice, game.players)
                break
            case 'lynch':
                game.lynch?.handleVotingChoice(select.choice)
                break
            case 'wolfFeast':
                game.wolfFeast?.handleVotingChoice(select.choice)
                break
        }
    })
}
