import {highlightPlayer} from "../../Utils/highlightPlayer";
import {RoleBase} from "../Abstract/RoleBase";
import {specialConditionMonarch} from "../../Utils/specialConditionTypes";

export class Monarch extends RoleBase {
    roleName = 'Монарх 🤴';
    roleIntroductionText = () => `Ты ${this.roleName}! `
    startMessageText = () => 'Как у главы королевской семьи, у тебя есть власть в этой деревне... ' +
        'По крайней мере, на один день! ' +
        `Ты можешь показать деревне свою корону и семейное древо, и один день они позволят тебе ` +
        `вершить правосудие лично.`
    weight = () => 3;

    specialCondition: specialConditionMonarch = {
        comingOut: undefined
    }

    actionAnnouncement = () => ({
        message: `Пока жители деревни обсуждают ночные проишествия, ${highlightPlayer(this.player)} делает ` +
            `шаг вперед, предлагая всем внимательно посмотреть на корону, которую он прятал раньше.\n` +
            `Сегодня *${this.roleName}* решит, кого казнить.`,
        gif: 'https://media.giphy.com/media/okLCopqw6ElCDnIhuS/giphy.gif'
    })

    stealMessage = () => this.specialCondition.comingOut === false && `\nОднако все в деревне уже узнали о монархе!`;

    action = () => {
        if (this.specialCondition.comingOut) { // Изменить переопределение comingOut после добавления голосования
            this.specialCondition.comingOut = false;
            return;
        }
        if (this.specialCondition.comingOut === false) return;

        Monarch.game.bot.sendMessage(
            this.player.id,
            'Желаешь ли ты раскрыться сегодня?',
            {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Раскрыться', callback_data: JSON.stringify({type: 'role', choice: 'uncover'})}],
                        [{text: 'Пропустить', callback_data: JSON.stringify({type: 'role', choice: 'skip'})}],
                    ]
                }
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    handleChoice = (choice?: string) => {
        if (choice !== 'uncover') {
            this.choiceMsgEditText();
            return;
        }

        this.specialCondition.comingOut = true;
        this.choiceMsgEditText();

        Monarch.game.bot.sendAnimation(
            Monarch.game.chatId,
            this.actionAnnouncement().gif, { caption: this.actionAnnouncement().message }
        )
    }

    choiceMsgEditText = () => {
        Monarch.game.bot.editMessageText(
            `Выбор принят — ${this.specialCondition.comingOut ? 'Раскрыться' : 'Пропустить'}.`,
            {
                message_id: this.choiceMsgId,
                chat_id: this.player.id,
            }
        )
    }
}