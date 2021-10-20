import {WolfBase} from "./WolfBase";
import {RoleBase} from "../RoleBase";

export class Lycan extends WolfBase {
    roleName = 'Ликан';
    startMessageText = 'Ты Ликан! Ты волк, но провидец видит тебя селянином :)';
    weight = RoleBase.game.players.find(player => player.role?.roleName === 'Seer' ||
        player.role?.roleName === 'Fool') ? 12 : 10; // Sets the weight of lycan depending on seer or fool presence
}