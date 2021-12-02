import {playerLink} from "./playerLink";
import {Player} from "../Game";
import {RoleBase} from "../Roles";
import {msToMinutes} from "./msToMinutes";

const bubbleAliveSort = (arr: Player[]) => {
    for (let i = 0; i < arr.length; i++)
        for (let j = 1; j < arr.length - i; j++)
            if (arr[j - 1].isAlive && !arr[j].isAlive) [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]]
}

export const playerGameList = (players: Player[]) => {
    bubbleAliveSort(players)
    return `Живые игроки (${players
            .filter(e => e.isAlive).length}/${players.length}):\n`
        + players.map(p => `${p.isAlive ? playerLink(p) : `*${p.name}*`}: ${p.isAlive
            ? '🙂 Жив(а)'
            : `💀 Мертв(а) — *${p.role?.roleName}*${p.lover ? '❤' : ''}`}`
        ).join('\n')
}

export const startPlayerList = (players: Player[]) => `Игроки (${players.length}):\n`
    + players.map(p => playerLink(p)).join('\n')

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
            return `${playerLink(p)}:`
                + `\t${p.won ? '🏆 Выиграл(а)' : '💩 Проиграл(а)'}\t—`
                + `\t${p.isAlive ? '🙂 Жив(а)' : '💀 Мертв(а)'}\t—`
                + `\t*${p.role?.roleName}* `
                + (previousRoles.length
                    ? `(${previousRoles.map(r => r.roleName?.match(/[\p{Emoji}\u200d]+/gu)).join(', ')})`
                    : '') + (p.lover ? '❤' : '')
        }).join('\n') + `\n\nВремя игры: *${getGameDurationTime()}*`
}

const getGameDurationTime = () => {
    if (RoleBase.game.gameStartedTime)
        return msToMinutes((new Date).getTime() - RoleBase.game.gameStartedTime)
}

