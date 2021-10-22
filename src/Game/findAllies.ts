import {RoleBase} from "../Roles/RoleBase";
import {Player} from "../Player/Player";
import {Wolf} from "../Roles";
import {highlightPlayer} from "./highlightPlayer";

export const findAllies = (player: Player, role = player.role) => // role для других ролей. Например, когда надо найти потенциальныхсоюзников для Проклятого (волков)
    RoleBase.game.players.filter(otherPlayer => role
        && otherPlayer.role instanceof role.constructor
        && otherPlayer !== player
        && otherPlayer.isAlive
    )

export const alliesMessage = (player: Player) => {
    const allies = findAllies(player);
    return allies.length
        ? `\nДругие ${(player.role instanceof Wolf ? 'волки' : 'каменщики')}: `
        + `${allies.map(ally => highlightPlayer(ally)).join(', ')}`
        : '';
}
