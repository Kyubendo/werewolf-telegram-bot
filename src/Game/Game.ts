import {Player} from "../Player/Player";
import {RoleBase} from "../Roles/RoleBase";
import TelegramBot from "node-telegram-bot-api";

export type GameStage = 'day' | 'night' | 'lynch' | undefined

export class Game {
    constructor(
        readonly mode: 'classic',
        readonly bot:TelegramBot,
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
        this.stage = this.stage === 'day' ? 'lynch' : this.stage === 'lynch' ? 'night' : 'day'
    }

    addPlayer(player: Player) {
        this.players.push(player)
    }
}