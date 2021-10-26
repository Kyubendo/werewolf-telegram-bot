import {Game, GameStage} from "../Game";
import {Player} from "../../Player/Player";
import {findPlayer} from "../findPlayer";
import TelegramBot from "node-telegram-bot-api";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {generateInlineKeyboard} from "../playersButtons";

export abstract class VotingBase {
    constructor(readonly game: Game) {
    }

    protected abstract voteStage: GameStage

    protected abstract votePromptMessage: string

    protected abstract getVoters(): Player[]

    protected abstract handleVoteResult(voteResult: Player[]): void

    protected abstract handleVotingChoiceResult(voter: Player, target?: Player): void

    protected abstract voteTargetCondition(otherPlayer: Player): boolean

    protected calculateVoteWeight = (target: Player) => 1

    protected beforeVotingAction?: () => void

    protected votes: { [id: string]: number } = {}

    protected votedPlayers: Player[] = []

    startVoting = () => {
        if (this.game.stage !== this.voteStage) return;
        this.beforeVotingAction && this.beforeVotingAction()
        setTimeout(() => this.getVoters().forEach(player => {
            this.game.bot.sendMessage(
                player.id,
                this.votePromptMessage,
                {
                    reply_markup: generateInlineKeyboard(this.game.players.filter(
                        otherPlayer => otherPlayer !== player && this.voteTargetCondition(otherPlayer)
                    ))
                }
            ).then(msg => {
                if (player.role) player.role.choiceMsgId = msg.message_id
            })
        }), 50)
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
    }

    handleVoteEnd = () => {
        if (this.game.stage !== this.voteStage) return;
        this.editSkipMessages()
        this.handleVoteResult(this.voteResult())
        this.votes = {}
        this.votedPlayers = []
    }

    private editSkipMessages = () =>
        this.getVoters().filter(v => !this.votedPlayers.includes(v)).forEach(voter => {
            this.game.bot.editMessageReplyMarkup(
                {inline_keyboard: []}, //custom message?
                {
                    message_id: voter.role?.choiceMsgId,
                    chat_id: voter.id,
                }
            )
        })

    private voteResult = () => {
        const maxVotesCount = Object.values(this.votes).reduce((a, c) => c > a ? c : a, 0)
        return Object.keys(this.votes)
            .filter(key => this.votes[key] === maxVotesCount)
            .map(id => findPlayer(id, this.game.players))
            .filter((e): e is Player => !!e)
    }
}
