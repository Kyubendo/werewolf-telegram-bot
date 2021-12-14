import {Player} from "../../Player/Player";
import {playerLink} from "../../Utils/playerLink";
import {DeathType} from "../../Game";
import {RoleBase, SerialKiller, Wolf} from "../index";

export class Drunk extends RoleBase {
    roleName = 'Пьяница 🍺';
    startMessageText = () => `Ищи себе собутыльников, тебе все равно ничего не осталось делать...` +
        `Однако, если тебя вдруг кто-то съест, он нехило опьянеет`;
    weight = () => Drunk.game.players.find(player => player.role instanceof Wolf) ? 3 : 1;


    async handleDeath(killer?: Player, type?: DeathType): Promise<boolean> {
        if ((killer?.role instanceof Wolf || killer?.role instanceof SerialKiller) && !type) {
            let text: string = killer.role.killMessage().text.toChat(this.player);
            if (killer?.role instanceof Wolf) {
                killer.role.findAllies().forEach(wolfPlayer => wolfPlayer.daysLeftToUnfreeze = 2);
                killer.daysLeftToUnfreeze = 2;
                text = `Один из мирных жителей утром обнаружил у себя в загоне со свиньями самого известного ` +
                    `Пьяницу ${playerLink(this.player)}, который, по словам следователей, ` +
                    `тусовался всю ночь со свиньями до последнего, а потом пришел волк и съел его!`;
            } else if (killer?.role instanceof SerialKiller) {
                text = `Селяне надеялись выпить стакан-другой с Пьяницей ${playerLink(this.player)}, но, зайдя ` +
                    `к нему домой, они увидели только сломанный нож и вырезанную печень.` +
                    `Он настолько посадил себе печень, что даже Серийный Убийца ею побрезговал.`;
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