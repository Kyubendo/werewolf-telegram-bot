import {VillagerBase} from "./VillagerBase";
import {playersButtons} from "../../Game/playersButtons";
import {Player} from "../../Player/Player";
import {Seer} from "./Seer";

export class Fool extends Seer {
    roleName = 'Дурак';
    weight = 4;

    handleChoice = (chosenPlayer?: Player) => {
        console.log(chosenPlayer)
    }
}
