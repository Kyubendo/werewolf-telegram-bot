import {Player} from "../Player/Player";
import TelegramBot from "node-telegram-bot-api";
import {gameStageMsg} from "./gameStageMsg";
import {playerList} from "./playerList";

export type GameStage = 'day' | 'night' | 'lynch' | undefined

export class Game {
    constructor(
        readonly mode: 'classic',
        readonly bot: TelegramBot,
        readonly players: Player[],
        readonly chatId: number,
        public playerCountMsgId: number,
    ) {
    }

    public stage: GameStage = undefined

    setNextStage() {
        this.players.filter(player => player.isAlive)
            .forEach(player => player.role?.actionResolve && player.role?.actionResolve())

        switch (this.stage) {
            case "day":
                this.stage = "lynch"
                break
            case "lynch":
                this.stage = "night"
                break
            case "night":
                this.stage = "day"
                break
            default:
                this.stage = "night"
        }

        this.bot.sendMessage(this.chatId, gameStageMsg(this.stage) || '')
            .then(() => {
                this.bot.sendMessage(this.chatId, playerList(this), {parse_mode: 'Markdown'})
            })
        this.players.filter(player => player.isAlive || !player.isFrozen)
            .forEach(player => player.role?.action && player.role.action())
    }

    addPlayer(player: Player) {
        this.players.push(player)
    }
}