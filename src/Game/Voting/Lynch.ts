import {GameStage} from "../Game";
import {generateInlineKeyboard} from "../playersButtons";
import {Monarch} from "../../Roles";
import {Player} from "../../Player/Player";
import {VotingBase} from "./VotingBase";

export class Lynch extends VotingBase {
    voteStage: GameStage = 'lynch'

    getActiveMonarchs = () => this.game.players
        .filter(player => player.role instanceof Monarch && player.role.comingOut && player.isAlive);

    getVoters = () => {
        const activeMonarchs = this.getActiveMonarchs()
        return activeMonarchs.length ? activeMonarchs : this.game.players.filter(p => p.isAlive)
    }

    startVoting = () => {
        this.getVoters().forEach(player => {
                this.game.bot.sendMessage(
                    player.id,
                    'За кого ты хочешь проголосовать?',
                    {
                        reply_markup: generateInlineKeyboard(
                            this.game.players.filter(otherPlayer => otherPlayer !== player && otherPlayer.isAlive))
                    }
                ).then(msg => {
                    if (player.role) player.role.choiceMsgId = msg.message_id
                })
            }
        )
    }

    handleVotingChoiceResult = () => {
        this.game.bot.sendMessage(
            this.game.chatId,
            `${this.votedPlayers.length} из ${this.getVoters().length} игроков проголосовало.`
        )
    }

    handleVoteResult(voteResult: Player | undefined | null) {
        voteResult
            ? voteResult.role?.onKilled()
            : this.game.bot.sendMessage(this.game.chatId,
            'Не удалось придти к одному решению! Расстроенная толпа расходится по домам...')
    }
}
