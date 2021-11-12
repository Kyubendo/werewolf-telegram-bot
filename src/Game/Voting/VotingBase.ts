import {Game, GameStage} from "../Game";
import {Player} from "../../Player/Player";
import {findPlayer} from "../findPlayer";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {generateInlineKeyboard} from "../playersButtons";
import {SelectType} from "../commands/callbackHandle";
import {Mayor} from "../../Roles/Villagers/Mayor";

export abstract class VotingBase {
    constructor(readonly game: Game) {
    }

    abstract voteStage: GameStage

    abstract votePromptMessage: string

    abstract type: string

    abstract getVoters(): Player[]

    abstract handleVoteResult(voteResult: Player[]): boolean | void

    abstract handleVotingChoiceResult(voter: Player, target?: Player): void

    abstract voteTargetCondition(otherPlayer: Player): boolean

    calculateVoteWeight = (target: Player) => (target.role instanceof Mayor
        && target.role.specialCondition.comingOut !== undefined) ? 2 : 1

    beforeVotingAction?: () => void

    votes: { [id: string]: number } = {}

    votedPlayers: Player[] = []

    startVoting = async () => {
        if (this.game.stage !== this.voteStage) return;
        this.beforeVotingAction && this.beforeVotingAction()
        for (const player of this.getVoters()) {
            await this.game.bot.sendMessage(
                player.id,
                this.votePromptMessage,
                {
                    reply_markup: generateInlineKeyboard(
                        this.game.players.filter(
                            otherPlayer => otherPlayer !== player && this.voteTargetCondition(otherPlayer)
                        ),
                        true,
                        this.type
                    )
                }
            ).then(msg => {
                if (player.role) player.role.choiceMsgId = msg.message_id
            })
        }
    }

    handleVotingChoice = (select: SelectType) => {
        if (this.game.stage !== this.voteStage) return;
        const voter = findPlayer(select.from.id, this.game.players)
        if (!voter || !voter.role || !this.getVoters().includes(voter)) return;
        this.votedPlayers.push(voter)
        let target: Player | undefined;
        if (select.choice !== 'skip') {
            target = findPlayer(select.choice, this.game.players)
            if (target) {
                const voteWeight = this.calculateVoteWeight(target)
                this.votes[target.id] ? this.votes[target.id] += voteWeight : this.votes[target.id] = voteWeight
            }
        }

        this.game.bot.editMessageText(
            `Выбор принят — ${target ? highlightPlayer(target) : 'Пропустить'}.`,
            {
                message_id: voter.role.choiceMsgId,
                chat_id: voter.id,
            })
        this.handleVotingChoiceResult(voter, target)
    }

    handleVoteEnd = () => {
        if (this.game.stage !== this.voteStage) return;
        this.editSkipMessages()
        if (this.handleVoteResult(this.voteResults())) return true

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
            ).catch(() => { // fix later
            })
        })

    private voteResults = () => {
        const maxVotesCount = Object.values(this.votes).reduce((a, c) => c > a ? c : a, 0)
        return Object.keys(this.votes)
            .filter(key => this.votes[key] === maxVotesCount)
            .map(id => findPlayer(id, this.game.players))
            .filter((e): e is Player => !!e)
    }
}
