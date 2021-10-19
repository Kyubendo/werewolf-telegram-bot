import {Game} from "./Game";

export const playerList = (game: Game) => {
    const players = game.players
    if (game.stage) {
        return `Живые игроки (${players.filter(e => e.isAlive).length}/${players.length}):\n`
            + players.map(e =>
                `[${e.name}](tg://user?id=${e.id}): ${e.isAlive ? '🙂 Жив(а)' : '💀 Мертв(а)'}`
            ).join('\n')
    }
    return `Игроки (${players.length}):\n`
        + players.map(e => `[${e.name}](tg://user?id=${e.id})`).join('\n')
}
