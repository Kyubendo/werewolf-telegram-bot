import *  as GameClass from "./Game";
import {Game} from "../entity/Game";
import {Player} from "../entity/Player";
import {Win} from "./checkEndGame";
import {User} from "../entity/User";
import {Role} from "../entity/Role";
import {getInitialRole} from "../Utils/getInitialRole";

export const saveGame = async (endedGame: GameClass.Game, winner: Win) => {
    const game = await Game.create({
        winner,
        duration: endedGame.gameStartedTime ? (new Date).getTime() - endedGame.gameStartedTime : 0,
    }).save()

    for (const p of endedGame.players) {
        const user = await User.getFromPlayer(p)
        if (!user) throw 'saveGame 19'

        const initialRole = p.role && await Role.getFromObject(getInitialRole(p.role))
        const finalRole = p.role && await Role.getFromObject(p.role)
        if (!initialRole || !finalRole) throw 'saveGame 23'

        const player = Player
            .create({game, user, initialRole, finalRole, won: p.won})
        player.loverUser = (p.lover && await User.findOne(p.lover.id)) ?? null
        await player.save()
    }
}
