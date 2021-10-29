import {Player} from "../Player/Player";
import TelegramBot from "node-telegram-bot-api";
import {gameStageMsg} from "./gameStageMsg";
import {playerList} from "../Utils/playerList";
import {Lynch} from "./Voting/Lynch";
import {WolfFeast} from "./Voting/WolfFeast";
import {roleResolves} from "./roleResolves";

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
    wolfFeast?: WolfFeast

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
        let stageDuration;
        let nextStage: GameStage;

        switch (this.stage) {
            case "day":
                nextStage = "lynch"
                stageDuration = this.lynchDuration
                break
            case "night":
                nextStage = "day"
                stageDuration = this.dayDuration
                break
            case "lynch":
                nextStage = "night"
                stageDuration = this.nightDuration
                break
            default:
                nextStage = "night"
                stageDuration = this.nightDuration
        }
        this.resetStageTimer(stageDuration)

        this.runResolves()
        this.stage = nextStage
        setTimeout(this.runActions, 50)

        setTimeout(() => // stupid kludge
                this.bot.sendMessage(this.chatId, gameStageMsg(this))
                    .then(() => {
                        this.bot.sendMessage(this.chatId, playerList(this),)
                    }),
            50)
    }

    private runResolves = () => {
        this.lynch?.handleVoteEnd()
        this.wolfFeast?.handleVoteEnd()
        for (const role of roleResolves(this.stage)) {
            this.players
                .filter(player => player.isAlive && player.role instanceof role)
                .forEach(player => player.role?.actionResolve && player.role.actionResolve())
        }
    }

    private runActions = () => {
        this.lynch?.startVoting()
        this.wolfFeast?.startVoting()
        this.stage === 'night' && this.players.forEach(player => player.isAlive && player.infected
            && player.transformInfected())
        for (const role of roleResolves(this.stage)) {
            this.players
                .filter(player => player.isAlive && !player.isFrozen && player.role instanceof role)
                .forEach(player => player.role?.action && player.role.action())
        }
    }

    addPlayer = (player: Player) => {
        this.players.push(player)
    }
}