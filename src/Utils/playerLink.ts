import {Player} from "../Game";

export const playerLink = (player: Player) => `[${player.name}](tg://user?id=${player.id})`;

export const playerLinkWithRole = (player: Player) => `*${player.role?.roleName}* ${playerLink(player)}`