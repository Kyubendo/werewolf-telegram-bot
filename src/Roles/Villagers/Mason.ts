import {Villager} from "./Villager";
import {RoleBase} from "../RoleBase";
import {alliesMessage, findAllies} from "../../Game/findAllies";

export class Mason extends Villager {
    roleName = 'Каменщик 👷';
    startMessageText = `Тебе ничего не остается делать, кроме как идти и пахать на стройке, ведь ты ${this.roleName}.`
        + alliesMessage(this.player);
    weight = () => {
        const otherMasonsAmount = findAllies(this.player).length;
        return (otherMasonsAmount ? 3 : 1) + otherMasonsAmount;
    }
}