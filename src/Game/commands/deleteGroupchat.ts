import TelegramBot from "node-telegram-bot-api";
import {State} from "../../Bot";
import {timer} from "../../Utils/Timer";
import {playerLink} from "../../Utils/playerLink";
import {Player} from "../../Game";

export const deleteGroupchat = (bot: TelegramBot, state: State) => {
    bot.onText(/\/delete_groupchat/, msg => {
        if (msg.chat.type === 'private' || msg.chat.type === 'channel' || !msg.from) return;

        const askingPlayer = new Player(msg.from);
        if (!state.game)
            bot.sendMessage(
                msg.chat.id,
                `@${askingPlayer.username},\nвозможно вы имели в виду ` +
                `/start_classic@${process.env.BOT_NAME}?`, {
                    parse_mode: undefined
                });
        else if (!state.game.chatDeleted) {
            if (!state.game.bannedPlayer) {
                state.game.bannedPlayer = askingPlayer;
                bot.sendMessage(msg.chat.id, 'Чат будет удалён через 3...');
                timer(() => bot.sendMessage(msg.chat.id, '2...'), 1_100)
                timer(() => bot.sendMessage(msg.chat.id, '1...'), 2_200)
                timer(() => {
                        bot.sendMessage(msg.chat.id,
                            `Игрок ${playerLink(askingPlayer)} заблокирован за попытку удалить чат.`
                        )
                        if (state.game)
                            state.game.chatDeleted = true;
                    }, 3_300
                )
            } else
                bot.sendMessage(msg.chat.id, `${playerLink(askingPlayer)}, процесс удаления чата уже начался.`)

        } else if (state.game.bannedPlayer) {
            if (askingPlayer.username === state.game.bannedPlayer.username)
                bot.sendMessage(msg.chat.id,
                    `${playerLink(state.game.bannedPlayer)}, вы заблокированы.`)
            else
                bot.sendMessage(msg.chat.id,
                    `${playerLink(state.game.bannedPlayer)} уже попытался удалить чат. Теперь он заблокирован.`)
        }
    })
}