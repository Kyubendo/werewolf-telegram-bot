import {RoleBase} from "../RoleBase";
import {Player} from "../../Player/Player";
import {Wolf} from "../Wolfs/Wolf";
import {highlightPlayer} from "../../Game/highlightPlayer";

export class SerialKiller extends RoleBase {
    roleName = 'Серийный убийца 🔪';
    startMessageText = `Ты ${this.roleName}! Недавно сбежал из психушки и твоя цель убить всех... ` +
        `Каждую ночь ты можешь добавить по одному телу в свою коллекцию!`
    weight = () => -15; // change?

    killMessage = (deadPlayer: Player) => `Эта ночь казалась довольно тихой для ${highlightPlayer(deadPlayer)}, ` +
        `но не тут-то было. Жители, собравшись, обнаружили расчлененное тело, но, на удивление, печени не было ` + `
        на месте... Серийный Убийца снова атаковал! ${highlightPlayer(deadPlayer)} был(а) ${deadPlayer.role?.roleName}`;

    handleDeath(killer?: Player) {
        if (killer?.role instanceof Wolf)
            killer.role.handleDeath(this.player);
        else
            super.handleDeath(killer);
    }
}