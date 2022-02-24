import {Player} from "../../Game";
import {playerLink} from "../../Utils/playerLink";
import {DeathType} from "../../Game";
import {RoleBase, RoleWeights, SerialKiller, Wolf} from "../index";

export class Drunk extends RoleBase {
    roleName = 'Пьяница 🍺';
    startMessageText = () => `Ищи себе собутыльников, тебе все равно ничего не осталось делать... ` +
        `Однако, если тебя вдруг кто-то съест, он нехило опьянеет.`;
    weight = (w: RoleWeights) => {
        this.activeWeight = Drunk.game.players.find(player => player.role instanceof Wolf)
            ? 'conditionWeight'
            : 'baseWeight';
        return w[this.activeWeight];
    }

    async handleDeath(killer?: Player, type?: DeathType): Promise<boolean> {
        if ((killer?.role instanceof Wolf || killer?.role instanceof SerialKiller) && !type) {
            let text: string = killer.role.killMessage().text.toChat(this.player);
            if (killer?.role instanceof Wolf) {
                killer.role.findAllies().forEach(wolfPlayer => wolfPlayer.daysLeftToUnfreeze = 2);
                killer.daysLeftToUnfreeze = 2;
                text = `Один из мирных жителей утром обнаружил у себя в загоне со свиньями самого известного ` +
                    `${playerLink(this.player, true)}, который, по словам следователей, ` +
                    `тусовался всю ночь со свиньями до последнего, а потом пришел волк и съел его!`;
            } else if (killer?.role instanceof SerialKiller) {
                text = `Селяне надеялись выпить стакан-другой с ${playerLink(this.player, true)}, но, зайдя ` +
                    `к нему домой, они увидели только сломанный нож и вырезанную печень. ` +
                    `Он настолько посадил себе печень, что даже ${killer.role.roleName} ею побрезговал.`;
            }

            await Drunk.game.bot.sendMessage(
                Drunk.game.chatId,
                text
            )

            await Drunk.game.bot.sendAnimation(
                this.player.id,
                killer.role.killMessage().gif,
                {
                    caption: killer.role.killMessage().text.toTarget
                }
            )

            this.player.isAlive = false;
            return true;
        }
        return super.handleDeath(killer, type);
    }
}