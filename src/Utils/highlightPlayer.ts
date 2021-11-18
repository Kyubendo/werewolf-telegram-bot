import {Player} from "../Game";

export const highlightPlayer = (player: Player) => `[${player.name}](tg://user?id=${player.id})`;