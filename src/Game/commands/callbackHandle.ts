import TelegramBot from "node-telegram-bot-api";
import {join} from "../callbacks/join";
import {State} from "../../Bot";
import {roleChoice} from "../callbacks/roleChoice";

export type SelectType = {
    type: string,
    choice: string,
    from: TelegramBot.User,
}
export const callbackHandle = (bot: TelegramBot, state: State) => {
    bot.on('callback_query', query => {
        const game = state.game
        if (!game || !query.data) return;
        const select: SelectType = JSON.parse(query.data)
        select.from = query.from
        switch (select.type) {
            case 'join':
                join(game, select)
                break
            case 'role':
                roleChoice(select, game.players)
                break
            case 'lynch':
                game.lynch?.handleVotingChoice(select)
                break
            case 'wolfFeast':
                game.wolfFeast?.handleVotingChoice(select)
                break
        }
    })
}
