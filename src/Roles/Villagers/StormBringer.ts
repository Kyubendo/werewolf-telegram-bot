import {RoleBase} from "../Abstract/RoleBase";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {gameStageMsg} from "../../Game/gameStageMsg";
import {playerGameList} from "../../Utils/playerLists";
import {checkEndGame} from "../../Game/checkEndGame";

export class StormBringer extends RoleBase {
    roleName = 'Шаман 🌩';
    roleIntroductionText = () => `Ты Древний ${this.roleName}!\n`
    startMessageText = () => 'У тебя во власти вся погода. ' +
        'Особенно хорошо у тебя получается призвать ужасный шторм. ' +
        'В случае, если ты вызовешь ночью ужасный шторм, ' +
        'все ночные роли будут искать убежища дома и ' +
        'никаких ночных действий совершить не смогут. ' +
        'Ты можешь вызвать шторм в любую ночь, но только один раз за игру.'
    weight = () => 4;

    actionAnnouncement = () => ({
        message: 'Все селяни легли спать, и ничто не предвещало плохой погоды. Однако кто-то заметил, ' +
            `как над домом ${highlightPlayer(this.player)} вспыхнула темно-синяя молния. ` +
            'Ужасный шторм внезапно начал надвигаться на деревню и все жители попрятались в свои дома, ' +
            'так и не решившись выйти совершать свои ночные действия.',
        gif: 'https://media.giphy.com/media/FZzbTJyRTwPuw/giphy.gif'
    })

    storm?: boolean; // Note: rework for Thief

    action = () => {
        if (this.storm === false) return;

        if (this.storm) {
            this.storm = false;
            return;
        }

        StormBringer.game.bot.sendMessage(
            this.player.id,
            'Желаешь ли ты призвать ужасный шторм сегодня?',
            {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Призвать', callback_data: JSON.stringify({type: 'role', choice: 'summon'})}],
                        [{text: 'Пропустить', callback_data: JSON.stringify({type: 'role', choice: 'skip'})}]
                    ]
                }
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    handleChoice = (choice?: string) => {
        if (choice !== 'spread') {
            this.choiceMsgEditText();
            return;
        }

        this.storm = true;
        this.choiceMsgEditText();

        StormBringer.game.bot.sendAnimation(
            StormBringer.game.chatId,
            this.actionAnnouncement().gif, { caption: this.actionAnnouncement().message }
        )


    }

    choiceMsgEditText = () => {
        StormBringer.game.bot.editMessageText(
            `Выбор принят — ${this.storm ? 'Призвать' : 'Пропустить'}.`,
            {
                message_id: this.choiceMsgId,
                chat_id: this.player.id,
            }
        )
    }

    // startDay = () => {
    //     StormBringer.game.clearSelects()
    //     StormBringer.game.checkNightDeaths('day')
    //
    //     StormBringer.game.stage = 'day'
    //
    //     const endGame = checkEndGame(StormBringer.game.players, StormBringer.game.stage)
    //     if(endGame){
    //         StormBringer.game.onGameEnd(endGame)
    //         return
    //     }
    //
    //     setTimeout(StormBringer.game.runActions, 30)
    //
    //     setTimeout(() => // stupid kludge
    //             StormBringer.game.bot.sendMessage( StormBringer.game.chatId, gameStageMsg(StormBringer.game))
    //                 .then(() => {
    //                     StormBringer.game.bot.sendMessage( StormBringer.game.chatId, playerGameList( StormBringer.game.players),)
    //                 }),
    //         50)
    // }
}