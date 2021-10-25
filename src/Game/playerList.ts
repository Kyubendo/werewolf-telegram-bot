import {Game} from "./Game";
import {highlightPlayer} from "../Utils/highlightPlayer";

export const playerList = (game: Game) => {
    const players = game.players
    if (game.stage) {
        return `Живые игроки (${players.sort((p) => -!p.isAlive )
                .filter(e => e.isAlive).length}/${players.length}):\n`
            + players.map(e =>
                `${e.isAlive ? highlightPlayer(e) : `*${e.name}*`}: ${e.isAlive ?
                    '🙂 Жив(а)' : `💀 Мертв(а) - *${e.role?.roleName}*`}`
            ).join('\n')
    }
    return `Игроки (${players.length}):\n`
        + players.map(e => `[${e.name}](tg://user?id=${e.id})`).join('\n')
}
