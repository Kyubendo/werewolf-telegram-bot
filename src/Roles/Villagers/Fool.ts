import {playerLink} from "../../Utils/playerLink";
import {randomElement} from "../../Utils/randomElement";
import {DeathType, Player} from "../../Game";
import {RoleBase, Seer} from "../";

export class Fool extends Seer {
    roleName = 'Дурак 🃏';

    forecastRoleName = (targetRole: RoleBase) => {
        if (Math.random() <= .5) {
            const wrongPlayers = Fool.game.players
                .filter(player => player.role?.constructor !== targetRole.constructor
                    && player.isAlive
                    && player !== this.player);
            const wrongRoles = [...new Set(wrongPlayers.map(player => player.role))];
            targetRole = randomElement(wrongRoles) ?? targetRole;
        }
        return `это *${this.seerSees(targetRole)}*!`;
    }

    async handleDeath(killer?: Player, type?: DeathType): Promise<boolean> {
        if (killer?.role && !type) {
            this.player.isAlive = false;
            await Fool.game.bot.sendMessage(
                Fool.game.chatId,
                'День начался с печальных новостей. Всем известный Провид... ' +
                `Так, стоп! Это же никакой не Провидец! Он... *${this.roleName}*!  ` +
                `Покойся не с миром, ${playerLink(this.player)}...`,
            )

            killer?.role?.killMessage && await Fool.game.bot.sendAnimation(
                this.player.id,
                killer?.role?.killMessage().gif,
                {
                    caption: killer.role.killMessage().text.toTarget
                }
            )
            this.player.isAlive = false;
            return true;
        } else
            return super.handleDeath(killer, type);
    }
}
