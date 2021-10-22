import {Villager} from "./Villager";
import {Wolf} from "../Wolfs/Wolf";
import {Player} from "../../Player/Player";

export class Drunk extends Villager {
    roleName = 'Пьяница 🍻';
    startMessageText = `Ты ${this.roleName}!\n Ищи себе собутыльников, тебе все равно ничего не осталось делать...` +
        `Однако, если тебя вдруг кто-то съест, он нехило опьянеет`;
    weight = () => Villager.game.players.find(player => player.role instanceof Wolf) ? 3 : 1;

    handleDeath(killer?: Player) {
        if (killer?.role instanceof Wolf) {
            killer.isFrozen = true;
            Drunk.bot.sendMessage(Villager.game.chatId, `Один из мирных жителей утром обнаружил у себя в загоне` +
                `со свиньями самого известного Пьяницу ${killer.name}, который, по словам следователей, тусовался всю` +
                `ночь со свиньями до последнего, а потом пришел волк и съел его!`)
        }
        super.handleDeath(killer);
    }
}