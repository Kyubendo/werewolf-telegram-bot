import {Player} from "../Player/Player";
import TelegramBot from "node-telegram-bot-api";
import {gameStageMsg} from "./gameStageMsg";
import {playerList} from "../Utils/playerList";
import {Lynch} from "./Voting/Lynch";

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

    lynch?: Lynch

    lynchDuration = 10_000
    dayDuration = 10000_000
    nightDuration = 5000_000

    stage: GameStage = undefined
    stageTimer?: NodeJS.Timer
    resetStageTimer = (stageDuration: number) => {
        this.stageTimer && clearTimeout(this.stageTimer)
        this.stageTimer = setTimeout(this.setNextStage, stageDuration)
    }

    setNextStage = () => {
        this.players.filter(player => player.isAlive)
            .forEach(player => player.role?.actionResolve && player.role?.actionResolve())

        let stageDuration;
        switch (this.stage) {
            case "day":
                this.stage = "lynch"
                stageDuration = this.lynchDuration
                this.lynch?.startVoting()
                break
            case "night":
                this.stage = "day"
                stageDuration = this.dayDuration
                break
            case "lynch":
                this.lynch?.handleVoteEnd()
                this.stage = "night"
                stageDuration = this.nightDuration
                break
            default:
                this.stage = "night"
                stageDuration = this.nightDuration
        }
        this.resetStageTimer(stageDuration)
        setTimeout(() => // stupid kludge
                this.bot.sendMessage(this.chatId, gameStageMsg(this))
                    .then(() => {
                        this.bot.sendMessage(this.chatId, playerList(this),)
                    }),
            50)
        this.players.filter(player => player.isAlive && !player.isFrozen)
            .forEach(player => player.role?.action && player.role.action())
    }

    addPlayer = (player: Player) => {
        this.players.push(player)
    }
}