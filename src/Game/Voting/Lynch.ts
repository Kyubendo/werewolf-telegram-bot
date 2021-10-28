import {GameStage} from "../Game";
import {Monarch} from "../../Roles";
import {Player} from "../../Player/Player";
import {VotingBase} from "./VotingBase";

export class Lynch extends VotingBase {
    voteStage: GameStage = 'lynch'
    type = 'lynch'
    votePromptMessage = 'За кого ты хочешь проголосовать?'

    getVoters = () => {
        const activeMonarchs = this.getActiveMonarchs()
        return activeMonarchs.length ? activeMonarchs : this.game.players.filter(p => p.isAlive)
    }

    voteTargetCondition = (otherPlayer: Player) => otherPlayer.isAlive

    getActiveMonarchs = () => this.game.players
        .filter(player => player.role instanceof Monarch && player.role.comingOut && player.isAlive);

    handleVotingChoiceResult = () => {
        this.game.bot.sendMessage(
            this.game.chatId,
            `${this.votedPlayers.length} из ${this.getVoters().length} игроков проголосовало.`
        )
        if (this.votedPlayers.length === this.getVoters().length) this.game.setNextStage()
    }

    handleVoteResult(voteResult: Player[]) {
        voteResult.length === 1
            ? voteResult[0].role?.onKilled()
            : this.game.bot.sendMessage(this.game.chatId,
            'Не удалось придти к одному решению! Расстроенная толпа расходится по домам...')
    }
}
