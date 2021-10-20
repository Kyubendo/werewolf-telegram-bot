import {Player} from "./Player/Player";
import * as Roles from "./Roles";
import {RoleBase} from "./Roles/RoleBase";
import {Game} from "./Game/Game";

const player = new Player({id: 0, first_name: 'test', is_bot: false,})
const rolePool = [Roles.Lycan, Roles.Seer,]

const game = new Game('classic', [player, player], 0, 0)
RoleBase.game = game

const weight = game.players.map((player, i) => player.role = new rolePool[i](player)).reduce((a, c) => a + c.weight(), 0)

console.log(weight)