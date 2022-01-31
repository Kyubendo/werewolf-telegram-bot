import {Seer, Fool, ApprenticeSeer, RoleBase, ForecasterBase} from "../index";
import {playerLink} from "../../Utils/playerLink";
import {wolfTeam} from "../../Roles";
import {findPlayer} from "../../Game/findPlayer";

export class Sorcerer extends ForecasterBase {
    roleName = 'Колдунья 🔮';
    roleIntroductionText = () => `Ты ${this.roleName}`;
    startMessageText = () => `и обьединишься ты охотнее с детьми ночи, ` +
        'нежели с селянами. Ночью ты можешь использовать свою силу, чтобы найти членов стаи волков и их союзников, ' +
        'а также провидцев. Ты победишь лишь тогда, когда победят волки. ' +
        'Наслаждайся убийством несчастных сельских жителей.'

    nightActionDone = false

    actionResult = async () => {
        if (!this.targetPlayer?.role) return;
        let roleName = this.forecastRoleName(this.targetPlayer.role);
        await Sorcerer.game.bot.sendMessage(
            this.player.id,
            roleName
                ? `Ты видишь, что ${playerLink(this.targetPlayer)} это *${roleName}*!`
                : `Ты пытаешься вглянуть на ${playerLink(this.targetPlayer)}, ` +
                'но не можешь разобрать, кто он(а). Но между тем, это не провидец и уж точно не твой союзник...'
        )
    }

    forecastRoleName = (targetRole: RoleBase): string | undefined => {
        if (wolfTeam.find(wolfAlly => targetRole instanceof wolfAlly))
            return targetRole.roleName;
        else if ((targetRole instanceof Seer && !(targetRole instanceof Fool))
            || (targetRole instanceof ApprenticeSeer && Math.random() < 0.5))
            return new Seer(this.player).roleName;
        return undefined;
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, ForecasterBase.game.players)
        this.choiceMsgEditText();
        this.doneNightAction()
    }
}