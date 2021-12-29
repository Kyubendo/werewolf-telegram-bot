import *  as GameClass from "./Game";
import {Game} from "../entity/Game";
import {Player} from "../entity/Player";
import {Win} from "./checkEndGame";
import {playerToUser} from "../Utils/playerToUser";
import {roleToEntity} from "../Utils/roleToEntity";
import {getInitialRole} from "../Utils/getInitialRole";

export const saveGame = async (endedGame: GameClass.Game, winner: Win) => {
    const game = new Game()
    game.winner = winner
    game.duration = endedGame.gameStartedTime ? (new Date).getTime() - endedGame.gameStartedTime : 0
    await endedGame.db.manager.save(game)
    for (const p of endedGame.players) {
        const user = await playerToUser(endedGame.db, p.id)
        if (!user) throw 'saveGame 19'

        const initialRole = p.role && await roleToEntity(endedGame.db, getInitialRole(p.role))
        const finalRole = p.role && await roleToEntity(endedGame.db, p.role)
        if (!initialRole || !finalRole) throw 'saveGame 23'

        const player = new Player()
        player.game = game
        player.user = user
        player.won = p.won
        player.initialRole = initialRole
        player.finalRole = finalRole
        player.loverUser = (p.lover && await playerToUser(endedGame.db, p.lover.id)) ?? null
        await endedGame.db.manager.save(player)
    }
}
