import {RoleBase} from "../index";
import {specialConditionRuler} from "../../Utils/specialConditionTypes";

export abstract class RulerBase extends RoleBase {
    weight = () => 4;

    specialCondition: specialConditionRuler = {
        comingOut: undefined
    }

    stealMessage = () => this.specialCondition.comingOut !== undefined
        && `Однако все в деревне уже узнали о твоём статусе!`

    action = () => {
        if (this.specialCondition.comingOut) { // Изменить переопределение comingOut после добавления голосования
            this.specialCondition.comingOut = false;
            return;
        }
        if (this.specialCondition.comingOut === false) return;

        RulerBase.game.bot.sendMessage(
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

        this.actionAnnouncement && RulerBase.game.bot.sendAnimation(
            RulerBase.game.chatId,
            this.actionAnnouncement().gif, {caption: this.actionAnnouncement().message}
        )
    }

    choiceMsgEditText = () => RulerBase.game.bot.editMessageText(
        `Выбор принят — ${this.specialCondition.comingOut ? 'Раскрыться' : 'Пропустить'}.`,
        {
            message_id: this.choiceMsgId,
            chat_id: this.player.id,
        }
    )
}