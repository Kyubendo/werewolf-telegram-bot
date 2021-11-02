import {highlightPlayer} from "./highlightPlayer";
import {Player} from "../Game";

const bubbleAliveSort = (arr: Player[]) => {
    for (let i = 0; i < arr.length; i++)
        for (let j = 1; j < arr.length - i; j++)
            if (arr[j - 1].isAlive && !arr[j].isAlive) [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]]
}

export const playerGameList = (players: Player[]) => {
    bubbleAliveSort(players)
    return `Живые игроки (${players
            .filter(e => e.isAlive).length}/${players.length}):\n`
        + players.map(e => `${e.isAlive ? highlightPlayer(e) : `*${e.name}*`}: ${e.isAlive ? '🙂 Жив(а)' : `💀 Мертв(а) `
            + ` — *${e.role?.roleName}*`}`
        ).join('\n')
}

export const startPlayerList = (players: Player[]) => `Игроки (${players.length}):\n`
    + players.map(p => highlightPlayer(p)).join('\n')

export const endPlayerList = (players: Player[]) => {
    bubbleAliveSort(players)
    return `Игроки:\n` + players
        .map(p => {
            let role = {...p.role}
            const previousRoles = []
            while (role.previousRole) {
                role = role.previousRole
                previousRoles.push(role)
            }
            return `${highlightPlayer(p)}:`
                + `\t${p.won ? '🏆 Выиграл(а)' : '💩 Проиграл(а)'}\t—`
                + `\t${p.isAlive ? '🙂 Жив(а)' : '💀 Мертв(а)'}\t—`
                + `\t*${p.role?.roleName}* `
                + (previousRoles.length
                    ? `(${previousRoles.map(r => r.roleName && r.roleName.match(/[\p{Emoji}\u200d]+/gu)).join(', ')})`
                    : '') + (p.lover ? '❤' : '')
        }).join('\n')
}
