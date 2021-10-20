import {WolfBase} from "./WolfBase";
import {Game} from "../../Game/Game";
import {playerList} from "../../Game/playerList";
import {Player} from "../../Player/Player";
import {RoleBase} from "../RoleBase";

export class Lycan extends WolfBase {
    roleName = 'Ликан';
    startMessageText = 'Ты Ликан! Ты волк, но провидец видит тебя селянином :)';
    weight = RoleBase.game.players.map(player => player.role?.roleName === 'Seer'
        || player.role?.roleName === 'Fool') ? 12 : 10; // sets the weight depending on seer or fool presence
}