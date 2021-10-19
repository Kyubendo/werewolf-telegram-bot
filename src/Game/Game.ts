import {Player} from "../Player/Player";

export type GameStage = 'day' | 'night' | 'lynch' | undefined

export class Game {
    constructor(
        readonly mode: 'classic',
        readonly players: Player[],
    ) {
    }

    public stage: GameStage = undefined

    nextStage() {
        if (!this.stage) {
            this.stage = 'night'
            return
        }
        this.stage = this.stage === 'day' ? 'lynch' : this.stage === 'lynch' ? 'night' : 'day'
    }

    addPlayer(player: Player) {
        this.players.push(player)
    }
}