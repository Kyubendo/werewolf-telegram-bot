import {Player} from "../Game";
import {
    ApprenticeSeer, Beholder, Blacksmith, ClumsyGuy, Cursed, Drunk, GuardianAngel, Gunner, Harlot, Martyr, Mason,
    Monarch, Oracle, Sandman, Seer, SerialKiller, Traitor, Villager, WiseElder, Wolf, WoodMan, WildChild, Beauty,
    JackOLantern, Pumpkin, Detective, Cupid, Princess, Mayor, Sorcerer, Prowler, Arsonist, Pacifist, Cowboy, Snowman,
    PuppetMaster
} from "../Roles";
import {GameStage} from "./Game";
import {playerLink} from "../Utils/playerLink";

const villagers: Function[] = [
    ApprenticeSeer, Beholder, ClumsyGuy, Cursed, Drunk, GuardianAngel, Gunner, Harlot, Mason, Mayor, Monarch, Oracle,
    Seer, Traitor, Villager, WiseElder, WoodMan, Martyr, Sandman, Blacksmith, WildChild, Beauty, Detective, Cupid,
    Princess, Pacifist, Cowboy, Snowman,
]

const wolfTeam: Function[] = [Wolf, Sorcerer, Prowler]
const nonWolfEvil = [SerialKiller, Arsonist, JackOLantern, PuppetMaster]
const goodKillers: Function[] = [Cowboy]
const evil: Function[] = [Wolf, ...nonWolfEvil]

export type Win = 'villagers' | 'serialKiller' | 'wolves' | 'lovers' | 'suicide' | 'nobody' | 'jack' |
    'arsonist' | 'puppetMaster'
export const checkEndGame = (players: Player[], stage: GameStage): undefined | { winners: Player[], type: Win } => {
    const wolvesTeamPlayers = players.filter(p => wolfTeam.find(wa => p.role instanceof wa))
    const villagersTeamPlayers = players.filter(p => villagers.find(v => p.role instanceof v))
    const alivePlayers = players.filter(p => p.isAlive)
    const aliveWolves = alivePlayers.filter(p => p.role instanceof Wolf)
    const aliveEvilPlayer = alivePlayers.find(p => evil.find(e => p.role instanceof e))
    const aliveJackPlayers = alivePlayers.filter(player => player.role instanceof JackOLantern);

    if (alivePlayers.length === 2 && alivePlayers[0].lover === alivePlayers[1]) {
        return {winners: alivePlayers.filter(player => player.lover), type: 'lovers'}
    }

    if (aliveJackPlayers.length
        && !alivePlayers.filter(p => !(p.role instanceof Pumpkin) && !(p.role instanceof JackOLantern)).length) {
        return {winners: players.filter(player => player.role instanceof JackOLantern), type: 'jack'}
    }

    if (!aliveEvilPlayer) {
        if (villagersTeamPlayers.find(p => p.isAlive)) return {
            winners: villagersTeamPlayers,
            type: 'villagers'
        }
        else return {winners: [], type: 'nobody'}
    }

    alivePlayers.find(p => p.role instanceof Gunner && p.role.specialCondition.ammo) && goodKillers.push(Gunner)
    const aliveUniqueEvilPlayers = [...new Set(alivePlayers
        .filter(p => nonWolfEvil.find(k => p.role instanceof k) || goodKillers.find(k => p.role instanceof k))
        .map(p => p.role!.constructor))]
    aliveWolves.length && aliveUniqueEvilPlayers.push(Wolf)

    if (aliveUniqueEvilPlayers.length > 1) {
        if (alivePlayers.length <= 2) {
            if (aliveJackPlayers.length) return undefined;

            const wolf = alivePlayers.find(p => p.role instanceof Wolf)
            const serialKiller = alivePlayers.find(p => p.role instanceof SerialKiller)
            const gunner = alivePlayers.find(p => p.role instanceof Gunner)
            const arsonist = alivePlayers.find(p => p.role instanceof Arsonist)
            const cowboy = alivePlayers.find(p => p.role instanceof Cowboy)
            const puppetMaster = alivePlayers.find(p => p.role instanceof PuppetMaster)

            if (puppetMaster) return {winners: [puppetMaster], type: 'puppetMaster'}
            if (wolf && serialKiller) return {winners: [serialKiller], type: 'serialKiller'}
            if ((wolf || serialKiller || arsonist) && gunner) {
                if (stage === 'day' || (arsonist && !gunner.readyToArson)) {
                    aliveEvilPlayer.role?.onKilled(gunner);
                    Gunner.game.bot.sendMessage(
                        Gunner.game.chatId,
                        `Вдруг раздаётся выстрел! Но никто уже не оборачивается посмотреть на ` +
                        `стоящего(ую) ${playerLink(gunner)} над ${playerLink(aliveEvilPlayer)}. ` +
                        `${gunner.role?.roleName} убивает злодея(ку) и побеждает, но какой ценой... ` +
                        `Все его(её) товарищи уже мертвы.`)
                    return {winners: villagersTeamPlayers, type: 'villagers'};
                }
                if (wolf) return {winners: wolvesTeamPlayers, type: 'wolves'}
                if (serialKiller) return {winners: [serialKiller], type: 'serialKiller'}
                if (arsonist) return {winners: players.filter(p => p.role instanceof Arsonist), type: 'arsonist'}
            }
            if (cowboy) {
                alivePlayers.forEach(p => p.isAlive = false)
                let customText = '';
                if (wolf)
                    customText = 'После захода солнца на главной площади деревни встречаются заклятые враги: ' +
                        `${cowboy.role?.roleName} (бывший Охотник) и волк, а именно ${wolf.role?.roleName}. ` +
                        `${playerLink(wolf)}, уже не скрывая своего истинного облика, набрасывается на ковбоя. ` +
                        `${playerLink(cowboy)} достаёт серебрянную пулю, ` +
                        `ловко вставляет её в барабан своего револьвера и выстреливает прямо в морду волку. ` +
                        `${playerLink(wolf)} падает, глубоко вонзая огромные клыки в плоть ${playerLink(cowboy)}.`;
                else if (serialKiller)
                    customText = 'Настаёт утро и на главной площади деревни встречаются двое оставшихся жителей. ' +
                        `Расстояние не позволяет ` +
                        `${playerLink(serialKiller, true)} подобраться к жертве и он(а) решает ` +
                        `достать свой любимый нож и метнуть его в последний раз. ` +
                        `${playerLink(cowboy, true)} в последний миг вынимает пистолет из кобуры и ` +
                        `выстреливает точно в голову ${playerLink(serialKiller)}, ` +
                        `после чего нож маньяка вонзается прямо в сердце ${playerLink(cowboy)}.`;
                else if (arsonist)
                    customText = `Хоть, как правило, ${playerLink(cowboy, true)} и чётко спит, ` +
                        `на этот раз он(а) не успевает проснуться вовремя. Весь его(её) дом уже объят пламенем, ` +
                        `а он(а), задержав дыхание, пытается выбраться из огненной ловушки. ` +
                        `Приблизившись к окну он(а) замечает хохочущий силуэт ${playerLink(arsonist)}. ` +
                        `${arsonist.role?.roleName} думает, что успешно сжёг последнего из селян, ` +
                        `и уже наслаждается победой. ${playerLink(cowboy)} из последних сил достаёт пистолет и ` +
                        `выпускает всю обойму в ${playerLink(arsonist)}, после чего теряет сознание и сгорает заживо.`

                Cowboy.game.bot.sendMessage(Cowboy.game.chatId, customText);
                return {winners: [], type: 'nobody'};
            }
            if (arsonist) return undefined;
        } else {
            return undefined
        }
    }

    if (aliveWolves.length * 2 >= alivePlayers.length) {
        return {winners: wolvesTeamPlayers, type: 'wolves'}
    }

    if (alivePlayers.length < 3) {
        if (aliveEvilPlayer.role instanceof PuppetMaster)
            return {winners: players.filter(p => p.role instanceof PuppetMaster), type: 'puppetMaster'}

        const serialKillers = alivePlayers.filter(p => p.role instanceof SerialKiller)
        if (serialKillers.length) {
            if (serialKillers.length === 2) {
                if (serialKillers.find(p => p.daysLeftToUnfreeze)) return undefined
                serialKillers.forEach(p => p.isAlive = false)
                return {winners: [], type: 'nobody'}
            }
            return {winners: [aliveEvilPlayer], type: 'serialKiller'}
        } else if (aliveEvilPlayer.role instanceof Arsonist) return {
            winners: players.filter(p => p.role instanceof Arsonist),
            type: 'arsonist'
        }
    }

    return undefined
}


export const setWinners = (winners: Player[], players: Player[]) => {
    winners.forEach(w => w.won = true)
    const lovers = players.map(player => player.lover);
    for (const lover of lovers) if (lover?.won && lover.lover) lover.lover.won = true;

    const sacrificedMartyrs = players.map(p => p.role).filter(r => (r instanceof Martyr) && r.diedForProtectedPlayer)
    for (const sm of sacrificedMartyrs) {
        if (sm instanceof Martyr) sm.player.won = !!sm.specialCondition.protectedPlayer?.won
    }
}