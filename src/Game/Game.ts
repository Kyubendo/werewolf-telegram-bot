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

    lynchDuration = 12_000
    dayDuration = 13_000
    nightDuration = 12_000

    dayCount = 0;

    deadPlayersCount = 0

    stage: GameStage = undefined
    startGameTimer: Timer
    stageTimer?: Timer

    gameStartedTime?: number
    started = false
    canPinPlayers = true

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


        if (await this.runResolves()) return//fix

        await this.runResults();
        this.clearAngel()
        this.clearSelects()

        const endGame = checkEndGame(this.players, this.stage)
        if (!process.env.ROLE_TEST && endGame) {
            this.onGameEnd(endGame)
            return
        }

        this.checkNightDeaths(nextStage)

        this.stage = nextStage

        if (this.stage === 'day')
            this.dayCount++;

        this.bot.sendMessage(this.chatId, gameStageMsg(this))
            .then(() => this.bot.sendMessage(this.chatId, playerGameList(this.players),))
            .then(() => this.clearTargetPlayers())
            .then(() => this.runActions())
    }

    onGameEnd = (endGame: { winners: Player[], type: Win }) => {
        setWinners(endGame.winners, this.players)
        this.bot.sendAnimation(
            this.chatId,
            endGameMessage[endGame.type].gif,
            {caption: endGameMessage[endGame.type].text}
        ).then(() => this.bot.sendMessage(this.chatId, endPlayerList(this.players)).then(() => this.deleteGame()))
        this.stageTimer?.stop()
    }

    private runResolves = async () => {
        if (this.lynch?.handleVoteEnd()) return true
        this.wolfFeast?.handleVoteEnd()

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
                        .forEach(wolfPlayer => wolfPlayer.isFrozen = true);
                    this.wolvesDeactivated = false;
                }

                if (!this.players.find(p => p.isAlive && !p.isFrozen)) await this.setNextStage();

                this.players.forEach(p => {
                    if (p.role?.nightActionDone && p.isAlive) p.role.nightActionDone = false
                })
            }

            if (this.stage === 'day')
                this.players.forEach(player => player.isFrozen = false)
        }
        await this.lynch?.startVoting()
        await this.wolfFeast?.startVoting()
        for (const role of roleResolves(this.stage)) {
            this.players
                .filter(player => player.isAlive && !player.isFrozen && player.role instanceof role)
                .forEach(player => player.role?.action?.())
        }
    }

    private runResults = async () => {
        for (const role of roleResolves(this.stage)) {
            const alivePlayers = this.players.filter(player => player.isAlive && !player.isFrozen && player.role instanceof role)
            for (const alivePlayer of alivePlayers) {
                await alivePlayer.role?.actionResult?.()
            }
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

    clearAngel = () => this.players.forEach(p => p.guardianAngel = undefined)

    checkNightDeaths = (nextStage: GameStage) => {
        if (nextStage === "night") this.deadPlayersCount = this.players.filter(p => !p.isAlive).length
        else if (nextStage === "day" && this.players.filter(p => !p.isAlive).length === this.deadPlayersCount) {
            this.bot.sendMessage(this.chatId, 'Подозрительно, но это правда — сегодня ночью никто не умер!')
        }
    }
}
