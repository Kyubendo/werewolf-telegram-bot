import {Seer} from "./Seer";
import {Player} from "../../Player/Player";
import {playerLink} from "../../Utils/playerLink";
import {randomElement} from "../../Utils/randomElement";
import {DeathType} from "../../Game";
import {RoleBase} from "../Abstract/RoleBase";

export class Fool extends Seer {
    roleName = 'Дурак 🃏';
    weight = () => 4;

    forecastRoleName = (targetRole: RoleBase) => {
        if (Math.random() <= 0.99) {
            const wrongPlayers = Fool.game.players.filter(player => player.role !== targetRole && player.isAlive);
            const wrongRoles = [...new Set(wrongPlayers.map(player => player.role))];
            console.log(wrongRoles)
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
