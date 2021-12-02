import {Player} from "../Game";

export const playerLink = (player: Player, withRole = false) =>
    (withRole ? `*${player.role?.roleName}* ` : '') + `[${player.name}](tg://user?id=${player.id})`;