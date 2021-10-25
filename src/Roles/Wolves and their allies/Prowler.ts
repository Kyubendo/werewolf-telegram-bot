import {ForecasterBase} from "../Abstract/ForecasterBase";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {RoleBase} from "../Abstract/RoleBase";

export class Prowler extends ForecasterBase {
    roleName = 'Сова 🦉';
    startMessageText = () => `Ты ${this.roleName}. Твои союзники — волки. ` +
        'Каждую ночь ты можешь гулять по деревне и подглядывать за селянами через окна домов. ' +
        'Ты увидишь, спит игрок ночью или нет. Если же его съедят, ты увидишь всю стаю волков и узнаешь их имена.'
    weight = () => -4;

    actionResolve = () => {
        if (Prowler.game.stage !== 'night' || !this.targetPlayer?.role) return;

        if (!this.targetPlayer.role) {
            Prowler.game.bot.sendMessage(
                this.player.id,
                this.forecastRoleName(this.targetPlayer.role)
            )
        }
    }

    forecastRoleName = (targetRole: RoleBase) => targetRole.targetPlayer
        ? `Ты заглянула в окошко ${highlightPlayer(targetRole.player)} и увидела там свет. ` +
        `Похоже, ${highlightPlayer(targetRole.player)} не спит этой ночью!`
        : 'Ты не можешь увидеть ничего через окно, ' +
        `потому что внутри дома ${highlightPlayer(targetRole.player)} не горит ни одна свеча. ` +
        `Вероятно, он(а) спит.`
}