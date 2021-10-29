import {ForecasterBase} from "../Abstract/ForecasterBase";
import {RoleBase} from "../Abstract/RoleBase";
import {Seer, Fool, ApprenticeSeer} from "../index";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {wolfTeam} from "../../Utils/teams";

export class Sorcerer extends ForecasterBase {
    roleName = 'Колдунья 🔮';
    roleIntroductionText = () => `Ты ${this.roleName} `;
    startMessageText = () => `и обьединишься ты охотнее с детьми ночи, ` +
        'нежели с селянами. Ночью ты можешь использовать свою силу, чтобы членов стаи волков и их союзников, ' +
        'а также провидцев. Ты победишь лишь тогда, когда победят волки. ' +
        'Наслаждайся убийством несчастных сельских жителей.'
    weight = () => -2;

    actionResolve = () => {
        if (!this.targetPlayer?.role) return;
        let roleName = this.forecastRoleName(this.targetPlayer.role);
        Sorcerer.game.bot.sendMessage(
            this.player.id,
            roleName
                ? `Ты видишь, что ${highlightPlayer(this.targetPlayer)} это *${roleName}*!`
                : `Ты пытаешься вглянуть на ${highlightPlayer(this.targetPlayer)}, ` +
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
}