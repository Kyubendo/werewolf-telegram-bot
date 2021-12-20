import {findPlayer} from "../findPlayer";
import {Player} from "../../Game";
import {SelectType} from "../commands/callbackHandle";

export const roleChoice = (select:SelectType, players: Player[]) => { // async?
    const handleChoice = findPlayer(select.from.id, players)?.role?.handleChoice
    handleChoice && handleChoice(select.choice)
}