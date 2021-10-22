import {Villager} from "./Villager";
import {Wolf} from "../Wolfs/Wolf";
import {Player} from "../../Player/Player";
import {SerialKiller} from "../Others/SerialKiller";

export class Drunk extends Villager {
    roleName = 'Пьяница 🍻';
    startMessageText = `Ты ${this.roleName}!\n Ищи себе собутыльников, тебе все равно ничего не осталось делать...` +
        `Однако, если тебя вдруг кто-то съест, он нехило опьянеет`;
    weight = () => Villager.game.players.find(player => player.role instanceof Wolf) ? 3 : 1;

    handleDeath(killer?: Player) {
        if (killer?.role instanceof Wolf) {
            killer.isFrozen = true;
            Drunk.game.bot.sendMessage(Drunk.game.chatId, `Один из мирных жителей утром обнаружил у себя в ` +
                `загоне со свиньями самого известного Пьяницу ${this.player.name}, который, по словам следователей, ` +
                `тусовался всю ночь со свиньями до последнего, а потом пришел волк и съел его!`);
        } else if (killer?.role instanceof SerialKiller) {
            Drunk.game.bot.sendMessage(Drunk.game.chatId, `Селяне надеялись выпить стакан-другой с Пьяницей` +
                `${this.player.name}, но, зайдя к нему домой, они увидели только сломанный нож и вырезанную печень.` +
                `Он настолько посадил себе печень, что даже Серийный Убийца ею побрезговал.`)
        } else
            super.handleDeath(killer);
    }
}