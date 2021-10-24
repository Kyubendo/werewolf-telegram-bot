import {Villager} from "./Villager";
import {highlightPlayer} from "../../Utils/highlightPlayer";

export class Monarch extends Villager {
    roleName = 'Монарх 👑';
    startMessageText = `Ты ${this.roleName}! ` +
        `Как у главы королевской семьи, у тебя есть власть в этой деревне... По крайней мере, на один день! ` +
        `Ты можешь показать деревне свою корону и семейное древо, и один день они позволят тебе ` +
        `вершить правосудие лично.`
    weight = () => 3;

    comingOut?: boolean;

    action = () => {
        if (Monarch.game.stage !== 'day' || this.comingOut === false) return;
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
                        [{text: 'Ракскрыться', callback_data: String('Раскрыться')}],
                        [{text: 'Пропустить', callback_data: String('Пропустить')}]
                    ]
                }
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    handleChoice = (choice?: string) => {

        if (choice !== 'Раскрыться') {
            this.choiceMsgEditText();
            return;
        }

        this.comingOut = true;
        this.choiceMsgEditText();

        Monarch.game.bot.sendMessage(
            Monarch.game.chatId,
            `Пока жители деревни обсуждают ночные проишествия, ${highlightPlayer(this.player)} делает ` +
            `шаг вперед, предлагая всем внимательно посмотреть на корону, которую он прятал раньше.\n` +
            `Сегодня ${this.roleName} решит, кого казнить.`, // GIF
            {
                parse_mode: 'Markdown'
            }
        )
    }

    choiceMsgEditText = () => {
        Monarch.game.bot.editMessageText(
            `Выбор принят: ${this.comingOut ? 'Раскрыться' : 'Пропустить'}.`,
            {
                message_id: this.choiceMsgId,
                chat_id: this.player.id,
                parse_mode: 'Markdown'
            }
        )
    }
}