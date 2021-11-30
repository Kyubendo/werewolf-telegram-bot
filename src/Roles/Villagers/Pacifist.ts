import {specialConditionPacifist} from "../../Utils/specialConditionTypes";
import {playerLink, playerLinkWithRole} from "../../Utils/playerLink";
import {RoleBase} from "../index";

export class Pacifist extends RoleBase {
    roleName = 'Пацифист ☮';
    roleIntroductionText = () => `Ты ${this.roleName}, `
    startMessageText = () => 'несущий мир и добро (хотя бы на один день). ' +
        'Один раз за игру ты можешь провести демонстрацию и ' +
        'заставить всех остальных обратить внимание на свободу и любовь. Они не смогут казнить в этот день.'
    weight = () => 2;

    specialCondition: specialConditionPacifist = {
        peace: undefined
    }

    stealMessage = () => this.specialCondition.peace !== undefined
        && '\nОднако предыдущий игрок уже провёл демонстрацию. Не думаю, что селяни согласятся на ещё одну...';

    actionAnnouncement = () => ({
        message: 'Пока все обсуждают, кого казнить следующим, ' +
            `${playerLinkWithRole(this.player)} проводит ` +
            'демонстрацию во имя добра и мира на улице. ' +
            'Все вспоминают, что любовь всегда побеждает зло. Селяне решают, что не будут казнить сегодня.',
        gif: 'https://media.giphy.com/media/HVweQ5FuSFZJe/giphy.gif'
    })

    action = () => {
        if (this.specialCondition.peace) {
            this.specialCondition.peace = false;
            return;
        }

        if (this.specialCondition.peace === false) return;

        Pacifist.game.bot.sendMessage(
            this.player.id,
            `Желаешь ли ты провести сейчас демонстрацию?`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{
                            text: 'Провести',
                            callback_data: JSON.stringify({type: 'role', choice: 'demo'})
                        }],
                        [{
                            text: 'Пропустить',
                            callback_data: JSON.stringify({type: 'role', choice: 'skip'})
                        }]
                    ]
                }
            }
        ).then(msg => this.actionMsgId = msg.message_id)
    }

    handleChoice = (choice?: string) => {
        if (choice === 'demo') {
            this.specialCondition.peace = true;
            if (Pacifist.game.stage === 'day') {
                Pacifist.game.bot.sendAnimation(
                    Pacifist.game.chatId,
                    this.actionAnnouncement().gif,
                    {
                        caption: this.actionAnnouncement().message
                    }
                )
            } else if (Pacifist.game.stage === 'lynch') {
                Pacifist.game.bot.sendAnimation(
                    Pacifist.game.chatId,
                    this.actionAnnouncement().gif,
                    {
                        caption: 'Жители уже проводят вечернее голосование, ' +
                            `но ${playerLink(this.player)} не может больше сдерживать эмоций. ` +
                            `Селяне наблюдают приверженность Пацифиста любви и миру. ` +
                            'Любовь всегда побеждает войну, ' +
                            'потому их голосование прекращено и решение о казни не будет исполнено.'

                    }
                )
                RoleBase.game.lynch?.editSkipMessages();
                RoleBase.game.setNextStage();
            }
        }
        this.choiceMsgEditText();
    }

    choiceMsgEditText = () => {
        return Pacifist.game.bot.editMessageText(
            `Выбор принят — ${this.specialCondition.peace ? 'Провести' : 'Пропустить'}.`,
            {
                message_id: this.actionMsgId,
                chat_id: this.player.id,
            }
        )
    }

} 