import {Player} from "../../Player/Player";
import {RoleBase} from "../Abstract/RoleBase";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Traitor} from "../Villagers/Traitor";
import {Beauty} from "../Villagers/Beauty";

export class Wolf extends RoleBase {
    findWolfPlayers = () => Wolf.game.players.filter(otherPlayer =>
        otherPlayer.role instanceof Wolf
        // && otherPlayer !== this.player
        && otherPlayer.isAlive
    )

    showWolfPlayers(): string {
        const allies = this.findWolfPlayers();
        return `${allies?.length > 1 ? ('\nВолки: '
            + allies?.map(ally => highlightPlayer(ally)).join(', ')) : ''}`
    }

    roleName = 'Волк 🐺';
    roleIntroductionText = () => `Новый ${this.roleName} в селе! `;
    startMessageText = () => `Молодец, добился успеха! Убивай каждую ночь селян и добейся победы!`
        + this.showWolfPlayers();
    weight = () => -10;

    killMessageAll = (deadPlayer: Player) => `НомномНОМномНОМНОМном... ${highlightPlayer(deadPlayer)} съели заживо!` +
        `\n${highlightPlayer(deadPlayer)} был(а) *${deadPlayer.role?.roleName}*.`
    killMessageDead = 'О нет! Ты съеден(а) волком!'; // GIF

    actionResolve = () => {
        if (!this.targetPlayer) return;

        if (this.targetPlayer.role instanceof Beauty) {
            this.loveBind(this.targetPlayer);
        } else {
            this.targetPlayer.role?.onKilled(this.player);
        }

        this.targetPlayer = undefined
    }

    handleDeath(killer?: Player): boolean {
        const traitorPlayer = Wolf.game.players.find(player => player.role instanceof Traitor && player.isAlive);
        if (this.findWolfPlayers().length <= 1 && traitorPlayer) {
            traitorPlayer.role = new Wolf(traitorPlayer, traitorPlayer.role);
            Wolf.game.bot.sendMessage(
                traitorPlayer.id,
                `Твое время настало, ты обрел новый облик, ${traitorPlayer.role.previousRole?.roleName}! ` +
                `Теперь ты ${traitorPlayer.role.roleName}!`
            )
        }
        return super.handleDeath(killer);
    }
}
