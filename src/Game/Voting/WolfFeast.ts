import {VotingBase} from "./VotingBase";
import {GameStage} from "../Game";
import {Player} from "../../Player/Player";
import {FallenAngel, Wolf} from "../../Roles";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {randomElement} from "../../Utils/randomElement";

export class WolfFeast extends VotingBase {
    voteStage: GameStage = 'night';
    type = 'wolfFeast'
    votePromptMessage = 'Кого ты хочешь съесть?'

    getVoters = () => this.game.players.filter(player => player.isAlive && player.role instanceof Wolf)

    voteTargetCondition = (otherPlayer: Player) => otherPlayer.isAlive && !(otherPlayer.role instanceof Wolf)
        && !(otherPlayer.role instanceof FallenAngel)

    beforeVotingAction = () => this.getVoters().length > 1
        && this.getVoters().forEach(player => this.game.bot.sendMessage(
            player.id,
            'Ты со стаей собрался покушать.'
        ))

    handleVoteResult = (voteResults: Player[]) => {
        if (!voteResults.length) {
            if (this.getVoters().length > 1) {
                this.getVoters().forEach(voter => this.game.bot.sendMessage(
                    voter.id,
                    'Ваша стая слишком долго выла на луну и вы не заметили как прошла ночь. Вы никого не съели!'
                ))
            }
            return;
        }

        const killerWolf = randomElement(this.getVoters()).role
        if (killerWolf) killerWolf.targetPlayer = randomElement(voteResults)
    }

    handleVotingChoiceResult = (voter: Player, target?: Player) => {
        voter.role && voter.role.doneNightAction()
        this.getVoters().filter(player => player !== voter).forEach(player => this.game.bot.sendMessage(
            player.id,
            target
                ? `${highlightPlayer(voter)} облизывается на ${highlightPlayer(target)}.`
                : `${highlightPlayer(voter)} облизывается в ожидании решения.`
        ))
    }
}