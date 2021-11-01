import {Player} from "../Player/Player";
import TelegramBot from "node-telegram-bot-api";
import {gameStageMsg} from "./gameStageMsg";
import {Lynch} from "./Voting/Lynch";
import {WolfFeast} from "./Voting/WolfFeast";
import {roleResolves} from "./roleResolves";
import {checkEndGame, setWinners, Win} from "./checkEndGame";
import {endPlayerList, playerGameList} from "../Utils/playerLists";
import {endGameMessage} from "../Utils/endGameMessage";
import {JackOLantern, Pumpkin} from "../Roles";

export type GameStage = 'day' | 'night' | 'lynch' | undefined

export class Game {
    constructor(
        readonly mode: 'classic',
        readonly bot: TelegramBot,
        readonly players: Player[],
        readonly chatId: number,
        readonly deleteGame: () => boolean,
        public playerCountMsgId: number,
    ) {
    }

    lynch?: Lynch
    wolfFeast?: WolfFeast

    lynchDuration = 120_000
    dayDuration = 120_000
    nightDuration = 120_000

    deadPlayersCount = 0

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

        if (this.runResolves()) return//fix


        this.clearSelects()

        const endGame = checkEndGame(this.players, this.stage)
        if(endGame){
            this.onGameEnd(endGame)
            return
        }

        this.checkNightDeaths(nextStage)

        this.runResults(); // check the position of runResults later

        this.stage = nextStage

        setTimeout(this.runActions, 30)

        setTimeout(() => // stupid kludge
                this.bot.sendMessage(this.chatId, gameStageMsg(this))
                    .then(() => {
                        this.bot.sendMessage(this.chatId, playerGameList(this.players),)
                    }),
            50)
    }

    onGameEnd = (endGame: { winners: Player[], type: Win }) => {
        setWinners(endGame.winners, this.players)
        this.bot.sendAnimation(
            this.chatId,
            endGameMessage[endGame.type].gif,
            {caption: endGameMessage[endGame.type].text}
        ).then(() => this.bot.sendMessage(this.chatId, endPlayerList(this.players)).then(() => this.deleteGame()))
        this.stageTimer && clearTimeout(this.stageTimer)
    }

    private runResolves = () => {
        if (this.lynch?.handleVoteEnd()) return true
        this.wolfFeast?.handleVoteEnd()

        // this.players.filter(player => player.role instanceof Pumpkin).forEach(pumpkinPlayer => {
        //     console.log('тыква')
        //     if (Math.random() >= 0.25)
        //         pumpkinPlayer.role = pumpkinPlayer.role?.previousRole?.createThisRole(pumpkinPlayer, pumpkinPlayer.role);
        //     else
        //         pumpkinPlayer.role = new JackOLantern(pumpkinPlayer, pumpkinPlayer.role);
        //     console.log(pumpkinPlayer.role?.roleName)
        // }) // Note: change to lynch actions


        for (const role of roleResolves(this.stage)) {
            this.players
                .filter(player => player.isAlive && player.role instanceof role)
                .forEach(player => player.role?.actionResolve && player.role.actionResolve())
        }
    }

    private runActions = () => {
        if (this.stage === 'night') this.players.forEach(p => {
            if (p.role?.nightActionDone) p.role.nightActionDone = false
        })
        if (this.stage !== 'lynch') { // change?
            this.players
                .filter(player => player.isAlive)
                .forEach(p => {
                    if (p.role?.handleDeath) p.role.handleDeath = p.role.originalHandleDeath
                })

            if (this.stage === 'day')
                this.players.forEach(player => player.isFrozen = false)
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

    private runResults = () => {
        for (const role of roleResolves(this.stage)) {
            this.players.filter(player => player.isAlive && !player.isFrozen && player.role instanceof role)
                .forEach(player => player.role?.actionResult && player.role.actionResult())
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

    checkNightDeaths = (nextStage: GameStage) => {
        if (nextStage === "night") this.deadPlayersCount = this.players.filter(p => !p.isAlive).length
        else if (nextStage === "day" && this.players.filter(p => !p.isAlive).length === this.deadPlayersCount) {
            this.bot.sendMessage(this.chatId, 'Подозрительно, но это правда — сегодня ночью никто не умер!')
        }
    }
}
