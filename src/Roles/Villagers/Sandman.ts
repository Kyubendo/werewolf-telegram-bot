import {RoleBase} from "../index";
import {specialConditionSandman} from "../../Utils/specialConditionTypes";
import {playerLink} from "../../Utils/playerLink";


export class Sandman extends RoleBase {
    roleName = 'Морфей 💤';
    roleIntroductionText = () => `Ты ${this.roleName}.`
    startMessageText = () => `Один раз за игру ты можешь использовать свою магию, чтобы заставить всех спать ` +
        `так крепко, что никто не сможет выполнить свои ночные действия.`

    specialCondition: specialConditionSandman = {
        sleep: undefined
    }

    stealMessage = () => this.specialCondition.sleep !== undefined
        && '\nОднако ты чувствуешь, что твоей магии не хватит на ещё одно заклинание...'

    actionAnnouncement = () => ({
        message: 'Пока жители деревни обсуждают события прошедшей ночи, ' +
            `${playerLink(this.player)} возвращается в дом и начинает ` +
            'напевать мягкую мелодию. Сегодня ночью все будут спать очень глубоко, ' +
            'и никто не сможет выполнить свои ночные действия.',
        gif: 'https://media.giphy.com/media/fvJIuEVeNjpYs/giphy.gif'
    })

    action = () => {
        if (this.specialCondition.sleep) {
            this.specialCondition.sleep = false;
            return;
        }

        if (this.specialCondition.sleep === false) return;

        Sandman.game.bot.sendMessage(
            this.player.id,
            'Желаешь ли ты использовать свою магию?',
            {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Использовать', callback_data: JSON.stringify({type: 'role', choice: 'magic'})}],
                        [{text: 'Пропустить', callback_data: JSON.stringify({type: 'role', choice: 'skip'})}]
                    ]
                }
            }
        ).then(msg => this.actionMsgId = msg.message_id)
    }

    actionResolve = async () => {
        if (!this.specialCondition.sleep) return

        Sandman.game.sandmanAbility = true;
    }

    handleChoice = (choice?: string) => {
        if (choice !== 'magic') {
            this.choiceMsgEditText();
            return;
        }

        this.specialCondition.sleep = true;
        this.choiceMsgEditText();

        Sandman.game.bot.sendAnimation(
            Sandman.game.chatId,
            this.actionAnnouncement().gif, {caption: this.actionAnnouncement().message}
        )
    }

    choiceMsgEditText = () => Sandman.game.bot.editMessageText(
        `Выбор принят — ${this.specialCondition.sleep ? 'Использовать' : 'Пропустить'}.`,
        {
            message_id: this.actionMsgId,
            chat_id: this.player.id,
        }
    )
}