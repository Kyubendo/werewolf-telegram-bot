import {playerLink} from "../../Utils/playerLink";
import {Beauty, RoleBase, Wolf} from "../index";
import {ForecasterBase} from "../Abstract/ForecasterBase";
import {DeathType} from "../Abstract/RoleBase";
import {Player} from "../../Player/Player";
import {findPlayer} from "../../Game/findPlayer";

export class Prowler extends ForecasterBase {
    roleName = 'Сова 🦉';
    roleIntroductionText = () => `Ты ${this.roleName}.`
    startMessageText = () => 'Твои союзники - волки. ' +
        'Каждую ночь ты можешь гулять по деревне и подглядывать за селянами через окна домов. ' +
        'Ты увидишь, спит игрок ночью или нет. Если же его съедят, ты увидишь всю стаю волков и узнаешь их имена.'
    weight = () => -4;

    showResult = true;

    nightActionDone = false;

    actionResolve = async () => {
        if (!this.targetPlayer?.role) return;

        if (this.targetPlayer.role instanceof Beauty && this.targetPlayer.lover !== this.player) {
            await this.player.loveBind(this.targetPlayer.role.player);
            this.showResult = false;
            return;
        }

        const currentTargetHandleDeath = this.targetPlayer.role.handleDeath.bind(this.targetPlayer.role)
        this.targetPlayer.role.handleDeath = async (killer?: Player, type?: DeathType) => {
            if (this.targetPlayer && !type && killer?.role instanceof Wolf) {
                const wolves = killer.role.findOtherWolfPlayers();
                wolves.unshift(killer)
                await RoleBase.game.bot.sendMessage(
                    this.player.id,
                    wolves.length > 1
                        ? `Когда ты заглянула в окно к ${playerLink(this.targetPlayer)}, ` +
                        `ты увидела, как стая волков пожирает беднягу. Ужасающее зрелище... ` +
                        `Ужасающее для ${playerLink(this.targetPlayer)}! ` +
                        'А для тебя отличное, ведь ты запомнила лица всех волков! '
                        + `\nВот они слева направо: ` + wolves?.map(wolf => playerLink(wolf)).join(', ')
                        : `Ты почти добралась до дома ${playerLink(this.targetPlayer)}, ` +
                        'как вдруг услышала ужасные вопли страха изнутри. Ты затаилась недалеко и увидела, ' +
                        `как ${playerLink(killer)}, выходит из дома в обличии волка. ` +
                        'Кажется, ты нашла своего союзника.'
                )
                this.showResult = false;
            }
            return currentTargetHandleDeath(killer, type);
        }
    }

    actionResult = async () => {
        if (!this.targetPlayer?.role) return;
        if (!this.showResult) {
            this.showResult = true;
            return;
        }

        await Prowler.game.bot.sendMessage(
            this.player.id,
            this.forecastRoleName(this.targetPlayer.role)
        )
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, ForecasterBase.game.players)
        this.choiceMsgEditText();
        this.doneNightAction();
    }

    forecastRoleName = (targetRole: RoleBase) => targetRole.targetPlayer
        ? `Ты заглянула в окошко ${playerLink(targetRole.player)} и увидела там свет. ` +
        `Похоже, ${playerLink(targetRole.player)} не спит этой ночью!`
        : 'Ты не можешь увидеть ничего через окно, ' +
        `потому что внутри дома ${playerLink(targetRole.player)} не горит ни одна свеча. ` +
        `Вероятно, он(а) спит.`
}