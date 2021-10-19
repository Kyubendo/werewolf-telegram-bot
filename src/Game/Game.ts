import {Player} from "../Player/Player";

export class Game {
    constructor(
        readonly mode: 'classic',
        readonly players: Player[],
        public stage?: 'day' | 'night' | 'lynch') {
    }

    nextStage() {
        this.stage = this.stage === 'day' ? 'night' : this.stage === 'night' ? 'lynch' : 'day'
    }

    addPlayer(player: Player) {
        this.players.push(player)
    }
}