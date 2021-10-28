import {findPlayer} from "../findPlayer";
import {Player} from "../../Player/Player";
import {SelectType} from "../commands/callbackHandle";

export const roleChoice = (select:SelectType, players: Player[]) => {
    const handleChoice = findPlayer(select.from.id, players)?.role?.handleChoice
    handleChoice && handleChoice(select.choice)
}