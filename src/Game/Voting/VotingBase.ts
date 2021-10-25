import {Game, GameStage} from "../Game";
import {Player} from "../../Player/Player";
import {findPlayer} from "../findPlayer";
import TelegramBot from "node-telegram-bot-api";
import {highlightPlayer} from "../../Utils/highlightPlayer";

export abstract class VotingBase {
    constructor(readonly game: Game) {
    }

    votes: { [id: number]: number } = {}
    votedPlayers: Player[] = []

    abstract getVoters(): Player[]

    abstract voteStage: GameStage

    abstract handleVoteResult(voteResult: Player | undefined | null): void

    abstract handleVotingChoiceResult(voter: Player, target?: Player): void

    calculateVoteWeight = (target: Player) => 1

    editSkipMessages = () =>
        this.getVoters().filter(v => !this.votedPlayers.includes(v)).forEach(voter => {
            this.game.bot.editMessageReplyMarkup(
                {inline_keyboard: []},//custom text
                {
                    message_id: voter.role?.choiceMsgId,
                    chat_id: voter.id,
                }
            )
        })

    voteResult = () => {
        let maxVotesTarget: number | undefined
        let equalVotesCount = 0
        if (!Object.keys(this.votes).length) return null
        Object.keys(this.votes).reduce((a, c) => {
            if (this.votes[+c] > a) {
                maxVotesTarget = +c
                return this.votes[+c]
            } else if (this.votes[+c] === a) equalVotesCount++
            return a
        }, 0)

        return maxVotesTarget && !equalVotesCount
            ? findPlayer(maxVotesTarget, this.game.players)
            : undefined
    }

    handleLynchKill = () => {
        this.editSkipMessages()
        this.handleVoteResult(this.voteResult())
        this.votes = {}
        this.votedPlayers = []
    }


    handleVotingChoice = (query: TelegramBot.CallbackQuery) => {
        if (!query || this.game.stage !== this.voteStage) return;
        const voter = findPlayer(query.from.id, this.game.players)
        if (!voter || !voter.role) return;
        this.votedPlayers.push(voter)
        let target: Player | undefined;
        if (query.data !== 'skip') {
            target = findPlayer(query.data, this.game.players)
            if (target) {
                const voteWeight = this.calculateVoteWeight(target)
                this.votes[target.id] ? this.votes[target.id] += voteWeight : this.votes[target.id] = voteWeight
            }
        }
        this.game.bot.editMessageText(
            `Выбор принят: ${target ? highlightPlayer(target) : 'Пропустить'}.`,
            {
                message_id: voter.role.choiceMsgId,
                chat_id: voter.id,
            })
        this.handleVotingChoiceResult(voter, target)
        if (this.votedPlayers.length === this.getVoters().length) this.game.setNextStage()
    }
}