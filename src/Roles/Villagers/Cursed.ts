import {Villager} from "./Villager";
import {Player} from "../../Player/Player";
import {Wolf} from "../Wolves/Wolf";
import {alliesMessage} from "../../Game/findAllies";
import {highlightPlayer} from "../../Utils/highlightPlayer";

export class Cursed extends Villager {
    roleName = 'Проклятый 😾';
    startMessageText = `Ты ${this.roleName}! Сейчас ты обычный смертный, ` +
        'но если волки выберут тебя съесть, ты станешь одним из них.';
    weight = () => {
        const wolvesAmount = Cursed.game.players.filter(player => player.role instanceof Wolf).length;
        return (wolvesAmount ? 1 - wolvesAmount : 1)
    }

    handleDeath = (killer?: Player) => {
        if (killer?.role instanceof Wolf) {
            this.player.role = new Wolf(this.player);
            this.player.role.previousRole = new Cursed(this.player);
            Cursed.game.bot.sendMessage(this.player.id,
                'Тебя попытался убить волк! НО ты Проклятый, поэтому теперь ты один из них...' // GIF
                + alliesMessage(this.player), {
                    parse_mode: 'Markdown',
                });
            Cursed.game.players.filter(player => player.role instanceof Wolf && player.isAlive)
                .forEach(player => Cursed.game.bot.sendMessage(
                    player.id,
                    `${highlightPlayer(this.player)} был(а) ${this.player.role?.previousRole?.roleName}, ` +
                    `поэтому он(а) теперь один(на) из вас! Поздравляем нового волка.`
                ))
            return false;
        } else {
            return super.handleDeath(killer);
        }
    }
}