import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {playerLink} from "../../Utils/playerLink";
import {RoleBase, RoleWeights} from "../";
import {specialConditionGunner} from "../../Utils/specialConditionTypes";

export class Gunner extends RoleBase {
    roleName = "Стрелок 🔫";
    roleIntroductionText = () => `${this.roleName} выходит на охоту!`
    startMessageText = () => 'У тебя есть две серебрянных пули, чтобы убить кого-то днем. ' +
        'Но имей ввиду, все услышат твой выстрел...';
    weight = (w: RoleWeights) => w.base;

    actionAnnouncement = () => ({
        message: this.targetPlayer ? 'Вдруг послышался выстрел!  Все село оборачивается, ' +
            `чтобы увидеть стоящего ${playerLink(this.player)} над ${playerLink(this.targetPlayer)}, и ` +
            'оружие все еще нацелено в голову...\n' +
            `${playerLink(this.targetPlayer)} был(а) *${this.targetPlayer.role?.roleName}*!` : 'ERROR! Gunner-19',
        gif: 'https://media.giphy.com/media/reNAILRU3ab96/giphy.gif'
    })

    specialCondition: specialConditionGunner = {
        ammo: 2
    }

    stealMessage = () => !this.specialCondition.ammo
        ? 'Однако все серебрянные пули уже кончились...'
        : this.specialCondition.ammo === 1
            ? 'Но целься аккуратно, у тебя остался только одна серебрянная пуля.'
            : 'У тебя осталось ещё две серебрянных пули.';


    action = () => {
        if (!this.specialCondition.ammo) return;

        Gunner.game.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь пристрелить сегодня?',
            {
                reply_markup: generateInlineKeyboard(Gunner.game.players.filter(p => p !== this.player && p.isAlive))
            }
        ).then(msg => this.actionMsgId = msg.message_id)
    }

    actionResolve = async () => {
        if (!this.targetPlayer?.role) return;

        await this.targetPlayer.role.onKilled(this.player, 'shotByGunner');

        this.specialCondition.ammo--;
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Gunner.game.players);
        this.choiceMsgEditText();
    }
}