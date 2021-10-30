import {Player} from "../Player/Player";
import TelegramBot from "node-telegram-bot-api";
import {gameStageMsg} from "./gameStageMsg";
import {Lynch} from "./Voting/Lynch";
import {WolfFeast} from "./Voting/WolfFeast";
import {roleResolves} from "./roleResolves";
import {checkEndGame, setWinners} from "./checkEndGame";
import {endPlayerList, playerGameList} from "../Utils/playerLists";
import {endGameMessage} from "../Utils/endGameMessage";

export type GameStage = 'day' | 'night' | 'lynch' | undefined

export class Game {
    constructor(
        readonly mode: 'classic',
        readonly bot: TelegramBot,
        readonly players: Player[],
        readonly chatId: number,
        readonly onEnd: () => boolean,
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

        this.clearSelects()
        this.stage = nextStage
        setTimeout(this.runActions, 30)

        setTimeout(() => // stupid kludge
                this.bot.sendMessage(this.chatId, gameStageMsg(this))
                    .then(() => {
                        this.bot.sendMessage(this.chatId, playerGameList(this.players),)
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
        if (this.stage !== 'lynch') { // change?
            this.players
                .filter(player => player.isAlive)
                .forEach(p => {
                    if (p.role?.handleDeath) p.role.handleDeath = p.role.originalHandleDeath
                })
        }
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

    clearSelects = () => {
        this.players.forEach(p => p.role?.choiceMsgId && this.bot.editMessageReplyMarkup(
            {inline_keyboard: []},
            {message_id: p.role.choiceMsgId, chat_id: p.id}
            ).catch(() => {  // fix later
            })
        )
    }
}