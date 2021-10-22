import {Villager} from "./Villager";
import {Player} from "../../Player/Player";
import {Wolf} from "../Wolfs/Wolf";
import {alliesMessage, findAllies} from "../../Game/findAllies";

export class Cursed extends Villager {
    roleName = 'Проклятый 😾';
    startMessageText = 'Ты Проклятый! Сейчас ты обычный смертный, ' +
        'но если волки выберут тебя съесть, ты станешь одним из них.';
    weight = () => {
        const otherCursedAmount = findAllies(this.player, this.player.role).length;
        return (otherCursedAmount ? 1 - otherCursedAmount: 1)
    }

    handleDeath = (killer?: Player) => {
        if (killer?.role instanceof Wolf) {
            this.player.role = new Wolf(this.player);
            this.player.role.previousRole = new Cursed(this.player);
            Cursed.game.bot.sendMessage(this.player.id,
                'Тебя попытался убить волк! НО ты Проклятый, поэтому теперь ты один из них...'
                + alliesMessage(this.player));
        } else {
            super.handleDeath(killer);
        }
    }
}