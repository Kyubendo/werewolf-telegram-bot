import {Villager} from "./Villager";
import {Player} from "../../Player/Player";
import {Wolf} from "../Wolfs/Wolf";
import {alliesMessage, findAllies} from "../../Game/findAllies";

export class Cursed extends Villager {
    roleName = 'Проклятый 😾';
    startMessageText = `Ты ${this.roleName}! Сейчас ты обычный смертный, ` +
        'но если волки выберут тебя съесть, ты станешь одним из них.';
    weight = () => {
        const otherCursedAmount = Cursed.game.players.filter(player => player.role instanceof Wolf).length;
        return (otherCursedAmount ? 1 - otherCursedAmount: 1)
    }

    handleDeath = (killer?: Player) => {
        if (killer?.role instanceof Wolf) {
            this.player.role = new Wolf(this.player);
            this.player.role.previousRole = new Cursed(this.player);
            Cursed.game.bot.sendMessage(this.player.id,
                'Тебя попытался убить волк! НО ты Проклятый, поэтому теперь ты один из них...'
                + alliesMessage(this.player), {
                    parse_mode: 'Markdown',
                });
        } else {
            super.handleDeath(killer);
        }
    }
}