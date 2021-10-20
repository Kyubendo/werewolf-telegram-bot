import {VillagerBase} from "./VillagerBase";
import {alivePlayersButtons} from "../../Game/playersButtons";
import {Player} from "../../Player/Player";
import {Seer} from "./Seer";

export class Fool extends Seer {
    roleName = 'Дурак';
    weight = 4;

    handleChoice = (chosenPlayer?: Player) => {
        console.log(chosenPlayer)
    }
}
