import {Villager} from "./Villager";
import {Wolf} from "../Wolves/Wolf";

export class Traitor extends Villager {
    roleName = 'Предатель 🖕';
    startMessageText = `Ты ${this.roleName}. Вот ты сейчас простой селянин, а убьют волков - станешь последним ` +
        `в их роде!`;
    weight = () => 0;

    //changes to Wolf if all Wolves are dead
    action = () => {
        if (Traitor.game.players.find(player => player instanceof Wolf))
            return
        this.player.role = new Wolf(this.player);
        this.player.role.previousRole = new Traitor(this.player);
        Traitor.game.bot.sendMessage(
            this.player.id,
            `Твое время настало, ты обрел новый облик, ${this.previousRole?.roleName}! Теперь ты ${this.roleName}!`
        )
    }
}