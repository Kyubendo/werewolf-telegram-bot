import {Player} from "../Player/Player";

export const highlightPlayer = (player: Player) => `[${player.name}](tg://user?id=${player.id})`;