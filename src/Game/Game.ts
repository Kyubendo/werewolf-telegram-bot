import {Player} from "../Game";
import TelegramBot from "node-telegram-bot-api";
import {gameStageMsg} from "./gameStageMsg";
import {Lynch} from "./Voting/Lynch";
import {WolfFeast} from "./Voting/WolfFeast";
import {roleResolves} from "./roleResolves";
import {endGameMessage} from "../Utils/endGameMessage";
import {endPlayerList, playerGameList} from "../Utils/playerLists";
import {checkEndGame, setWinners, Win} from "./checkEndGame";
import {Doppelganger, Wolf} from "../Roles";
import {timer, Timer} from "../Utils/Timer";
import {gameStart} from "./gameStart";

export type GameStage = 'day' | 'night' | 'lynch' | undefined

export class Game {
    constructor(
        readonly mode: 'classic',
        readonly bot: TelegramBot,
        readonly players: Player[],
        readonly chatId: number,
        readonly deleteGame: () => void,
        public playerCountMsgId: number,
    ) {
        this.startGameTimer = timer(() => {
            if (this.stage) return
            if (this.players.length < 6) {
                bot.sendMessage(this.chatId, 'Время вышло, игра отменяется!')
                deleteGame()
            } else gameStart(bot, this)
        }, 600_000)
    }

    lynch?: Lynch
    wolfFeast?: WolfFeast

    wolvesDeactivated: boolean = false

    lynchDuration = 60_000
    dayDuration = 120_000
    nightDuration = 60_000

    dayCount = 0;

    deadPlayersCount?: number

    stage: GameStage = undefined
    startGameTimer: Timer
    stageTimer?: Timer

    gameStartedTime?: number
    started = false
    canPinPlayers = true
    private stageStopped = false
    stopStage = () => this.stageStopped = true


    setNextStage = async () => {
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
        this.stageTimer
            ? this.stageTimer.reset(stageDuration)
            : this.stageTimer = timer(this.setNextStage, stageDuration);

        if (this.stageStopped) this.stageStopped = false
        else await this.beforeStageChange()

        if (this.stageStopped) return

        await this.checkNightDeaths(nextStage)

        this.stage = nextStage

        await this.afterStageChange()
    }

    beforeStageChange = async () => {
        await this.runResolves()
        await this.runResults();

        this.clearAngel()
    }

    afterStageChange = async () => {
        this.clearSelects()

        const endGame = checkEndGame(this.players, this.stage)
        if (!process.env.ROLE_TEST && endGame) {
            await this.onGameEnd(endGame)
            return
        }

        if (this.stage === 'day')
            this.dayCount++;

        await this.bot.sendMessage(this.chatId, gameStageMsg(this))
        await this.bot.sendMessage(this.chatId, playerGameList(this.players))
        this.clearTargetPlayers()
        this.runActions()
    }

    onGameEnd = async (endGame: { winners: Player[], type: Win }) => {
        setWinners(endGame.winners, this.players)
        await this.bot.sendAnimation(
            this.chatId,
            endGameMessage[endGame.type].gif,
            {caption: endGameMessage[endGame.type].text}
        )
        await this.bot.sendMessage(this.chatId, endPlayerList(this.players)).then(() => this.deleteGame())
        this.stageTimer?.stop()
    }

    private runResolves = async () => {
        await this.lynch?.handleVoteEnd()
        await this.wolfFeast?.handleVoteEnd()

        for (const role of roleResolves(this.stage)) {
            for (const player of this.players.filter(p => p.isAlive && p.role instanceof role)) {
                await player.role?.actionResolve?.();
            }
        }
    }

    private clearTargetPlayers = () => this.players
        .filter(p => p.isAlive && p.role?.targetPlayer && !(p.role instanceof Doppelganger))
        .forEach(p => {
            if (p.role)
                p.role.targetPlayer = undefined
        })

    private runActions = async () => {
        if (this.stage !== 'lynch') { // change?
            this.players
                .filter(player => player.isAlive)
                .forEach(p => {
                    if (p.role?.handleDeath) p.role.handleDeath = p.role.originalHandleDeath
                })

            if (this.stage === 'night') {
                this.players.forEach(player => player.isAlive && player.infected && player.transformInfected())

                if (this.wolvesDeactivated) {
                    this.players
                        .filter(player => player.role instanceof Wolf && player.isAlive)
                        .forEach(wolfPlayer => wolfPlayer.daysLeftToUnfreeze = 1);
                    this.wolvesDeactivated = false;
                }

                if (!this.players.find(p => p.isAlive && !p.daysLeftToUnfreeze)) await this.setNextStage();

                this.players.forEach(p => {
                    if (p.role?.nightActionDone && p.isAlive) p.role.nightActionDone = false
                })
            }

            this.stage === 'day' && this.players
                .forEach(player => player.daysLeftToUnfreeze > 0 && player.daysLeftToUnfreeze--)
        }
        await this.lynch?.startVoting()
        await this.wolfFeast?.startVoting()
        for (const role of roleResolves(this.stage)) {
            this.players
                .filter(player => player.isAlive && !player.daysLeftToUnfreeze && player.role instanceof role)
                .forEach(player => player.role?.action?.())
        }
    }

    private runResults = async () => {
        for (const role of roleResolves(this.stage)) {
            const alivePlayers = this.players
                .filter(player => player.isAlive && !player.daysLeftToUnfreeze && player.role instanceof role)
            for (const alivePlayer of alivePlayers) {
                await alivePlayer.role?.actionResult?.()
            }
        }
    }

    addPlayer = (player: Player) => {
        this.players.push(player)
    }

    clearSelects = () => {
        this.players.forEach(p => p.role?.actionMsgId && this.bot.editMessageReplyMarkup(
                {inline_keyboard: []},
                {message_id: p.role.actionMsgId, chat_id: p.id}
            ).catch(() => {  // fix later
            })
        )
    }

    clearAngel = () => this.players.forEach(p => p.guardianAngel = undefined)

    checkNightDeaths = async (nextStage: GameStage) => {
        if (nextStage === "night") this.deadPlayersCount = this.players.filter(p => !p.isAlive).length
        else if (nextStage === "day" && this.players.filter(p => !p.isAlive).length === this.deadPlayersCount) {
            await this.bot.sendMessage(this.chatId, 'Подозрительно, но это правда — сегодня ночью никто не умер!')
        }
    }
}
