import {Player} from "../../Game";
import {DeathType} from "../../Game";
import {playerLink} from "../../Utils/playerLink";
import {Beauty, GuardianAngel, RoleBase, Traitor} from "../index";

export class Wolf extends RoleBase {
    findOtherWolfPlayers = () => Wolf.game.players.filter(otherPlayer =>
        otherPlayer.role instanceof Wolf
        && otherPlayer !== this.player
        && otherPlayer.isAlive
    )

    showOtherWolfPlayers(): string {
        const allies = this.findOtherWolfPlayers();
        if (!allies.length)
            return '\nНо ты один в стае, крепись.'
        return `\n${(allies.length > 1
            ? '\nДругие волки: '
            : 'Твой брат по волчьему делу — ')
        + allies?.map(ally => playerLink(ally)).join(', ')}`
    }

    roleName = 'Волк 🐺';
    roleIntroductionText = () => `Новый ${this.roleName} в селе!`;
    startMessageText = () => `Молодец, добился успеха! Убивай каждую ночь селян и добейся победы!`
        + this.showOtherWolfPlayers();

    weight = () => -10;

    nightActionDone = false

    killMessage = () => ({
        text: {
            toChat: (deadPlayer: Player) => `НомномНОМномНОМНОМном... ${playerLink(deadPlayer)} съели заживо!` +
                `\n${playerLink(deadPlayer)} был(а) *${deadPlayer.role?.roleName}*.`,
            toTarget: 'О нет! Ты съеден(а) волком!'
        },
        gif: 'https://media.giphy.com/media/10arlAx4rI0xHO/giphy.gif'
    })

    actionResolve = async () => {
        if (!this.targetPlayer) return;

        if (this.targetPlayer.guardianAngel?.role instanceof GuardianAngel) {
            await this.handleGuardianAngel(this.player);
            return;
        } else if (this.targetPlayer.role instanceof Beauty && this.targetPlayer.lover !== this.player) {
            await this.player.loveBind(this.targetPlayer);
        } else {
            await this.targetPlayer.role?.onKilled(this.player);
        }
    }

    async handleDeath(killer?: Player, type?: DeathType): Promise<boolean> {
        const traitorPlayer = Wolf.game.players.find(player => player.role instanceof Traitor && player.isAlive);

        if (this.findOtherWolfPlayers().length <= 0 && traitorPlayer) {
            traitorPlayer.role = new Wolf(traitorPlayer, traitorPlayer.role);
            await Wolf.game.bot.sendMessage(
                traitorPlayer.id,
                `Твое время настало, ты обрел новый облик, ${traitorPlayer.role.previousRole?.roleName}! ` +
                `Теперь ты ${traitorPlayer.role.roleName}!`
            )
        }

        return super.handleDeath(killer, type);
    }
}
