import {RoleBase} from "../Abstract/RoleBase";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Wolf} from "../Wolves and their allies/Wolf";
import {Traitor} from "./Traitor";

export class Blacksmith extends RoleBase {
    roleName = 'Кузнец ⚒';
    roleIntroductionText = () => `Ты ${this.roleName} `;
    startMessageText = () => '- ремесленник по металлу этой деревни. ' +
        'Ты не умеешь кучи серебра, но у тебя его достаточно, ' +
        'чтобы предотвратить волчью атаку ровно на одну ночь. ' +
        'Днём ты можешь растолочь и распылить его по всей деревне. ' +
        'А в остальном ты простой селянин.'
    weight = () => Blacksmith.game.players.filter(player => player.role instanceof Wolf)
        ? 5
        : Blacksmith.game.players.filter(player => player.role instanceof Traitor) // Or WildChild
            ? 4
            : 3

    silverDust ?: boolean;

    action = () => {
        if (this.silverDust === false) return;
        else if (this.silverDust) {
            this.silverDust = false;
            return;
        }

        Blacksmith.game.bot.sendMessage(
            this.player.id,
            'Желаешь ли ты распылить сегодня серебрянную пыль?',
            {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Распылить', callback_data: JSON.stringify({type: 'role', choice: 'spread'})}],
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

        this.silverDust = true;
        this.choiceMsgEditText();

        Blacksmith.game.bot.sendMessage(
            Blacksmith.game.chatId,
            'Во время дискуссии по поводу произошедших событий селяне неожиданно увидели, ' +
            `как ${highlightPlayer(this.player)} блуждает вокруг и ` +
            'разбрасывает серебрянную пыль повсюду на землю.  Сейчас, по крайней мере, ' +
            'деревня защищена от нападения волков. (Этой ночью волки дезактивированы)' // GIF
        )

        Blacksmith.game.players.filter(player => player.role instanceof Wolf /*|| player.infected*/)
            .forEach(player => player.isFrozen = true);
    }

    choiceMsgEditText = () => {
        Blacksmith.game.bot.editMessageText(
            `Выбор принят — ${this.silverDust ? 'Распылить' : 'Пропустить'}.`,
            {
                message_id: this.choiceMsgId,
                chat_id: this.player.id,
            }
        )
    }
}