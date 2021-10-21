import {RoleBase} from "../Roles/RoleBase";
import {Player} from "../Player/Player";
import {Mason, Wolf} from "../Roles";

/*export*/
const findAllies = (player: Player) => {
    console.log('После фильтра:' + RoleBase.game.players.filter(p =>
        player.role /* doesn't work without confirming if player.role is undefined or not*/
        && p.role instanceof player.role.constructor && p !== player));
    console.log()
    return RoleBase.game.players.filter(p =>
        player.role /* doesn't work without confirming if player.role is undefined or not*/
        && p.role instanceof player.role.constructor && p !== player)
}


export const alliesMessage = (player: Player) => {
    const allies = findAllies(player);
    return allies.length > 0 ? '\nДругие ' + (player.role instanceof Wolf ? 'волки' : 'каменщики') + ': ' +
        allies.map(ally => ally.name) : ''; // Возвращает либо строку с сообщением либо пустую строку
}
