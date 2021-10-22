import {RoleBase} from "../Roles/RoleBase";
import {Player} from "../Player/Player";
import {Mason, Wolf} from "../Roles";

const findAllies = (player: Player) => RoleBase.game.players.filter(otherPlayer =>
    player.role
    && otherPlayer.role instanceof player.role.constructor
    && otherPlayer !== player
    && otherPlayer.isAlive
)

export const alliesMessage = (player: Player) => {
    const allies = findAllies(player);
    return allies.length
        ? `\nДругие ${(player.role instanceof Wolf ? 'волки' : 'каменщики')}: `
        + `${allies.map(ally => ally.name).join(', ')}`
        : '';
}
