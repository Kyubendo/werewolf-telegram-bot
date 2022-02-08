import {VotingBase} from "./VotingBase";
import {GameStage} from "../Game";
import {Player} from "../../Game";
import {AlphaWolf, Wolf} from "../../Roles";
import {playerLink} from "../../Utils/playerLink";
import {randomElement} from "../../Utils/randomElement";

export class WolfFeast extends VotingBase {
    voteStage: GameStage = 'night';
    type = 'wolfFeast'
    votePromptMessage = 'Кого ты хочешь съесть?'

    getVoters = () => this.game.players.filter(
        player => player.isAlive
            && !player.daysLeftToUnfreeze
            && player.role instanceof Wolf
    )

    voteTargetCondition = (otherPlayer: Player) => otherPlayer.isAlive && !(otherPlayer.role instanceof Wolf)

    beforeVotingAction = async () => {
        if (this.getVoters().length <= 1) return
        for (const voter of this.getVoters()) {
            await this.game.bot.sendMessage(
                voter.id,
                'Ты со стаей собрался покушать.'
            );
        }
    }

    handleVoteResult = async (voteResults: Player[]) => {
        if (!voteResults.length) {
            if (this.getVoters().length > 1) {
                this.getVoters().forEach(voter => this.game.bot.sendMessage(
                    voter.id,
                    'Ваша стая слишком долго выла на луну и вы не заметили как прошла ночь.'
                ))
            }
            return;
        }

        const killerWolf = this.getVoters()
            .find(v => v.role instanceof AlphaWolf)?.role ?? randomElement(this.getVoters())?.role
        if (killerWolf) killerWolf.targetPlayer = randomElement(voteResults)
    }

    handleVotingChoiceResult = async (voter: Player, target?: Player) => {
        voter.role?.doneNightAction()
        this.getVoters().filter(player => player !== voter).forEach(player => this.game.bot.sendMessage(
            player.id,
            target
                ? target.role instanceof AlphaWolf
                ? target.role.roleName + ` ${playerLink(voter)} облизывается на ${playerLink(target)}.`
                : `${playerLink(voter)} облизывается на ${playerLink(target)}.`
                : `${playerLink(voter)} облизывается в ожидании решения.`
        ))
    }

    calculateVoteWeight = (voter: Player) => (voter.role instanceof AlphaWolf) ? 2 : 1;
}