import TelegramBot from "node-telegram-bot-api";
import {Player, Game, GameMode} from "../../Game";
import {State} from "../../Bot";
import {Lynch} from "../Voting/Lynch";
import {WolfFeast} from "../Voting/WolfFeast";
import {startPlayerList} from "../../Utils/playerLists";
import {validGameMode} from "../../Utils/validGameMode";
import {sendLeaveMessage} from "../callbacks/join";

export const joinButton = {
    inline_keyboard: [
        [{text: 'Присоединиться', callback_data: JSON.stringify({type: 'join'})}]
    ]
}

export const leaveButton = {
    inline_keyboard: [
        [{text: 'Выйти', callback_data: JSON.stringify({type: 'leave'})}]
    ]
}

const news = [
    'Добавлена случайная задержка ночи при отсутствии активных ролей.',
    'Добавлена кнопка выхода.',
    `Исправлено ${~~((new Date).getTime() / 100_000)} багов.`,
]

const messageAppend = (news.length
        ? '\n\n*Новости:*\n' + news.map(n => `— _${n}_`).join('\n')
        : '')
    + '\n\n[Баги и предложения сюда](https://trello.com/invite/b/cnBejMgi/38d6f76319eff47662ca0836f496c0d4/werewolf-bot-public)'

const gameModeName = (gameMode: GameMode) => {
    switch (gameMode) {
        case "classic":
            return 'классическая'
    }
}

export const startGame = (bot: TelegramBot, state: State,) => {
    bot.onText(new RegExp(`\/start_(.+)@${process.env.BOT_NAME}`), async (msg, match) => {
        if (msg.chat.id !== +(process.env.MAIN_CHAT || 0)) return;
        const gameMode = match?.[1]
        if (!validGameMode(gameMode)) return

        if (msg.chat.type === 'private' || msg.chat.type === 'channel') {
            bot.sendMessage(msg.chat.id, 'Игру можно начать только в групповом чате.')
            return;
        }
        if (!msg.from) return;
        if (state.game) {
            bot.sendMessage(
                msg.chat.id,
                'Игру уже запустили, просто нажми на кнопку.',
                {
                    reply_markup: joinButton
                })
            return;
        }
        const onEnd = async () => {
            state.game?.stageTimer?.stop()

            // if (state.game?.chatId) {
            //     for (const p of state.game?.players || []) {
            //         await unSilentPlayer(state.game.chatId, String(p.id), bot)
            //     }
            // }
            delete state.game
        }
        const initPlayer = new Player(msg.from)
        state.game = new Game(gameMode, bot, [initPlayer], msg.chat.id, onEnd, 0)
        await state.game.savePlayer(initPlayer)

        state.game.lynch = new Lynch(state.game)
        state.game.wolfFeast = new WolfFeast(state.game)

        await bot.sendAnimation(
            msg.chat.id,
            'https://media.giphy.com/media/SirUFDS5F83Go/giphy.gif',
            {
                caption: `Новая *${gameModeName(gameMode)}* игра начата игроком ${msg.from?.first_name +
                    (msg.from.last_name ? ' ' + msg.from.last_name : '')}!\nУ тебя есть десять минут, чтобы` +
                    ` присоединиться и быть съеденным(ой)!${messageAppend}`,
                reply_markup: joinButton,
            }
        ).then(msg => bot.pinChatMessage(msg.chat.id, String(msg.message_id)))
            .then(() => state.game && bot.sendMessage(
                msg.chat.id,
                startPlayerList(state.game.players),
            ).then(msg => state.game!.playerCountMsgId = msg.message_id))
        await sendLeaveMessage(initPlayer, state.game);
    })
}
