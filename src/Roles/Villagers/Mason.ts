import {Villager} from "./Villager";
import {RoleBase} from "../RoleBase";
import {alliesMessage} from "../../Game/findAllies";

export class Mason extends Villager {
    roleName = 'Каменщик 👷';
    startMessageText = 'Тебе ничего не остается делать, кроме как идти и пахать на стройке, ведь ты Каменщик.'
        + alliesMessage(this.player);
    weight = () => {
        const otherMasons = RoleBase.game.players
            .filter(player => player.role instanceof Mason && player !== this.player);
        return (otherMasons.length ? 3 : 1) + otherMasons.length;
    }
}