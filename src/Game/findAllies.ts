import {RoleBase} from "../Roles/RoleBase";
import {Player} from "../Player/Player";
import {Wolf} from "../Roles";
import {highlightPlayer} from "../Utils/highlightPlayer";

export const findAllies = (player: Player) =>
    RoleBase.game.players.filter(otherPlayer => player.role
        && otherPlayer.role instanceof player.role.constructor
        && otherPlayer !== player
        && otherPlayer.isAlive
    )

export const alliesMessage = (player: Player) => {
    const allies = findAllies(player);
    return allies.length ? (`\nДругие ${(player.role instanceof Wolf ? 'волки' : 'каменщики')}: `
        + `${allies.map(ally => highlightPlayer(ally)).join(', ')}`) : '';
}
