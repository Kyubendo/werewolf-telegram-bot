import {ForecasterBase} from "../Abstract/ForecasterBase";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {DeathType, RoleBase} from "../Abstract/RoleBase";
import {Beauty} from "../Villagers/Beauty";
import {Player} from "../../Player/Player";
import {Wolf} from "./Wolf";

export class Prowler extends ForecasterBase {
    roleName = 'Сова 🦉';
    roleIntroductionText = () => `Ты ${this.roleName}.\n`
    startMessageText = () => 'Твои союзники - волки. ' +
        'Каждую ночь ты можешь гулять по деревне и подглядывать за селянами через окна домов. ' +
        'Ты увидишь, спит игрок ночью или нет. Если же его съедят, ты увидишь всю стаю волков и узнаешь их имена.'
    weight = () => -4;

    actionResolve = () => {
        if (!this.targetPlayer?.role) return;

        if (this.targetPlayer.role instanceof Beauty && this.targetPlayer.lover !== this.player) {
            this.loveBind(this.targetPlayer.role.player);
            return;
        }

        const currentTargetHandleDeath = this.targetPlayer.role.handleDeath;
        this.targetPlayer.role.handleDeath = (killer?: Player, type?: DeathType) => {
            if (!this.targetPlayer) return false; // Note: probably fix this later

            if (killer?.role instanceof Wolf) {
                const wolves = killer.role.findOtherWolfPlayers();
                wolves.unshift(killer)
                RoleBase.game.bot.sendMessage(
                    this.player.id,
                    wolves.length > 1
                        ? `Когда ты заглянула в окно к ${highlightPlayer(this.targetPlayer)}, ` +
                        `ты увидела, как стая волков пожирает беднягу. Ужасающее зрелище... ` +
                        `Ужасающее для ${highlightPlayer(this.targetPlayer)}! ` +
                        'А для тебя отличное, ведь ты запомнила лица всех волков! '
                        + `\nВот они слева направо: ` + wolves?.map(wolf => highlightPlayer(wolf)).join(', ')
                        : `Ты почти добралась до дома ${highlightPlayer(this.targetPlayer)}, ` +
                        'как вдруг услышала ужасные вопли страха изнутри. Ты затаилась недалеко и увидела, ' +
                        `как ${highlightPlayer(killer)}, выходит из дома в обличии волка. ` +
                        'Кажется, ты нашла своего союзника.'
                )
            }
            return currentTargetHandleDeath(killer, type);
        }
    }

    actionResult = () => {
        if (!this.targetPlayer?.role) return;

        Prowler.game.bot.sendMessage(
            this.player.id,
            this.forecastRoleName(this.targetPlayer.role)
        )
    }

    forecastRoleName = (targetRole: RoleBase) => targetRole.targetPlayer
        ? `Ты заглянула в окошко ${highlightPlayer(targetRole.player)} и увидела там свет. ` +
        `Похоже, ${highlightPlayer(targetRole.player)} не спит этой ночью!`
        : 'Ты не можешь увидеть ничего через окно, ' +
        `потому что внутри дома ${highlightPlayer(targetRole.player)} не горит ни одна свеча. ` +
        `Вероятно, он(а) спит.`

}