import {ForecasterBase} from "../Abstract/ForecasterBase";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {RoleBase} from "../Abstract/RoleBase";
import {GameStage} from "../../Game/Game";
import {Beauty} from "../Villagers/Beauty";

export class Prowler extends ForecasterBase {
    roleName = 'Сова 🦉';
    roleIntroductionText = () => `Ты ${this.roleName}. `
    startMessageText = () => 'Твои союзники - волки. ' +
        'Каждую ночь ты можешь гулять по деревне и подглядывать за селянами через окна домов. ' +
        'Ты увидишь, спит игрок ночью или нет. Если же его съедят, ты увидишь всю стаю волков и узнаешь их имена.'
    weight = () => -4;

    actionResolve = () => {
        if (!this.targetPlayer?.role) return;

        if (this.targetPlayer.role instanceof Beauty) {
            this.loveBind(this.targetPlayer.role.player);
            if (this.targetPlayer !== this.player) {
                Prowler.game.bot.sendMessage(
                    this.player.id,
                    this.forecastRoleName(this.targetPlayer.role)
                )
            }
        }
    }

    actionResult = () => {
        if (!this.targetPlayer?.role) return;


    }

    forecastRoleName = (targetRole: RoleBase) => targetRole.targetPlayer
        ? `Ты заглянула в окошко ${highlightPlayer(targetRole.player)} и увидела там свет. ` +
        `Похоже, ${highlightPlayer(targetRole.player)} не спит этой ночью!`
        : 'Ты не можешь увидеть ничего через окно, ' +
        `потому что внутри дома ${highlightPlayer(targetRole.player)} не горит ни одна свеча. ` +
        `Вероятно, он(а) спит.`

}