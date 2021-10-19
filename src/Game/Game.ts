import {Player} from "../Player/Player";

export type GameStage = 'day' | 'night' | 'lynch' | undefined

export class Game {
    constructor(
        readonly mode: 'classic',
        readonly players: Player[],
        readonly chatId:number,
        public playerCountMsgId:number,
    ) {
    }

    public stage: GameStage = undefined

    setNextStage() {
        if (!this.stage) {
            this.stage = 'night'
            return
        }
        this.stage = this.stage === 'day' ? 'night' : this.stage === 'night' ? 'lynch' : 'day'
    }

    addPlayer(player: Player) {
        this.players.push(player)
    }
}