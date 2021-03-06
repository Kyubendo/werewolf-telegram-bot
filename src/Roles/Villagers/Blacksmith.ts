import {RoleBase, RoleWeights} from "../";
import {playerLink} from "../../Utils/playerLink";
import {specialConditionBlacksmith} from "../../Utils/specialConditionTypes";
import {Traitor, WildChild, Wolf} from "../index";

export class Blacksmith extends RoleBase {
    roleName = 'Кузнец ⚒';
    roleIntroductionText = () => `Ты ${this.roleName}`;
    startMessageText = () => '- ремесленник по металлу этой деревни. ' +
        'Ты не имеешь кучи серебра, но у тебя его достаточно, ' +
        'чтобы предотвратить волчью атаку ровно на одну ночь. ' +
        'Днём ты можешь растолочь и распылить его по всей деревне. ' +
        'А в остальном ты простой селянин.'
    weight = (weights: RoleWeights) => {
        this.activeWeight = Blacksmith.game.players.find(p => p.role instanceof Wolf)
            ? 'conditionWeight'
            : Blacksmith.game.players.find(p => p.role instanceof Traitor || p.role instanceof WildChild)
                ? 'conditionWeight2'
                : 'baseWeight'
        return weights[this.activeWeight];
    }

    actionAnnouncement = () => ({
        message: 'Во время дискуссии по поводу произошедших событий селяне неожиданно увидели, ' +
            `как ${playerLink(this.player)} блуждает вокруг и ` +
            'разбрасывает серебрянную пыль повсюду на землю.  Сейчас, по крайней мере, ' +
            'деревня защищена от нападения волков.',
        gif: 'https://media.giphy.com/media/dUBR5zjuoZwBChZ1aC/giphy.gif'
    })

    specialCondition: specialConditionBlacksmith = {
        silverDust: undefined
    }

    stealMessage = () => this.specialCondition.silverDust !== undefined
        && '\nОднако ты видишь, что серебрянная пыль уже кончилась'


    action = () => {
        if (this.specialCondition.silverDust) {
            this.specialCondition.silverDust = false;
            return;
        }

        if (this.specialCondition.silverDust === false) return;

        Blacksmith.game.bot.sendMessage(
            this.player.id,
            'Желаешь ли ты распылить серебрянную пыль сегодня?',
            {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Распылить', callback_data: JSON.stringify({type: 'role', choice: 'spread'})}],
                        [{text: 'Пропустить', callback_data: JSON.stringify({type: 'role', choice: 'skip'})}]
                    ]
                }
            }
        ).then(msg => this.actionMsgId = msg.message_id)
    }

    actionResolve = async () => {
        if (this.specialCondition.silverDust)
            Blacksmith.game.blacksmithAbility = true;
    }

    handleChoice = (choice?: string) => {
        if (choice !== 'spread') {
            this.choiceMsgEditText();
            return;
        }

        this.specialCondition.silverDust = true;
        this.choiceMsgEditText();

        Blacksmith.game.bot.sendAnimation(
            Blacksmith.game.chatId,
            this.actionAnnouncement().gif, {caption: this.actionAnnouncement().message}
        )
    }

    choiceMsgEditText = () => Blacksmith.game.bot.editMessageText(
        `Выбор принят — ${this.specialCondition.silverDust ? 'Распылить' : 'Пропустить'}.`,
        {
            message_id: this.actionMsgId,
            chat_id: this.player.id,
        }
    )
}