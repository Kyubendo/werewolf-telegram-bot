import {highlightPlayer} from "../../Utils/highlightPlayer";
import {RoleBase} from "../Abstract/RoleBase";

export class Monarch extends RoleBase {
    roleName = 'Монарх 🤴';
    roleIntroductionText = () => `Ты ${this.roleName}! `
    startMessageText = () => 'Как у главы королевской семьи, у тебя есть власть в этой деревне... ' +
        'По крайней мере, на один день! ' +
        `Ты можешь показать деревне свою корону и семейное древо, и один день они позволят тебе ` +
        `вершить правосудие лично.`
    weight = () => 3;

    comingOut?: boolean;

    action = () => {
        if (this.comingOut === false) return;
        if (this.comingOut) { // Изменить переопределение comingOut после добавления голосования
            this.comingOut = false;
            return;
        }

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

        this.comingOut = true;
        this.choiceMsgEditText();

        Monarch.game.bot.sendMessage(
            Monarch.game.chatId,
            `Пока жители деревни обсуждают ночные проишествия, ${highlightPlayer(this.player)} делает ` +
            `шаг вперед, предлагая всем внимательно посмотреть на корону, которую он прятал раньше.\n` +
            `Сегодня *${this.roleName}* решит, кого казнить.`, // GIF
        )
    }

    choiceMsgEditText = () => {
        Monarch.game.bot.editMessageText(
            `Выбор принят: ${this.comingOut ? 'Раскрыться' : 'Пропустить'}.`,
            {
                message_id: this.choiceMsgId,
                chat_id: this.player.id,
            }
        )
    }
}