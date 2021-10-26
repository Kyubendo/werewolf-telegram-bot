import {Player} from "../../Player/Player";
import {RoleBase} from "../RoleBase";
import {alliesMessage} from "../../Game/findAllies";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Traitor} from "../Villagers/Traitor";

export class Wolf extends RoleBase {
    roleName = 'Волк 🐺';
    startMessageText = `Ты ${this.roleName}. Скушай всё село.` + alliesMessage(this.player);
    weight = () => -10;

    killMessageAll = (deadPlayer: Player) => `НомномНОМномНОМНОМном... ${highlightPlayer(deadPlayer)} съели заживо!` +
        `\n${highlightPlayer(deadPlayer)} был(а) ${deadPlayer.role?.roleName}.`
    killMessageDead = 'О нет! Ты съеден(а) волком!'; // GIF

    actionResolve = () => {
        if (Wolf.game.stage !== 'night' || !this.targetPlayer) return;
        this.targetPlayer.role?.onKilled(this.player);
        this.targetPlayer = undefined
    }

    handleDeath(killer?: Player): boolean {
        const traitorPlayer = Wolf.game.players.find(player => player.role instanceof Traitor && player.isAlive);
        if (Wolf.game.players.filter(player => player.role instanceof Wolf && player.isAlive).length <= 1 && traitorPlayer) {
            const previousRole = traitorPlayer.role;
            traitorPlayer.role = new Wolf(traitorPlayer);
            traitorPlayer.role.previousRole = previousRole;
            Wolf.game.bot.sendMessage(
                traitorPlayer.id,
                `Твое время настало, ты обрел новый облик, ${traitorPlayer.role.previousRole?.roleName}! ` +
                `Теперь ты ${traitorPlayer.role.roleName}!`
            )
        }
        return super.handleDeath(killer);
    }
}
