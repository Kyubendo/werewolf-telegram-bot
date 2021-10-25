import {Seer} from "./Seer";
import {Fool} from "./Fool";
import {Player} from "../../Player/Player";
import {RoleBase} from "../Abstract/RoleBase";

export class Beholder extends RoleBase {
    roleName = 'Очевидец 👁';
    private seers?: Player[] = Beholder.game.players
        .filter(player => player.role instanceof Seer && !(player.role instanceof Fool));

    startMessageText = () =>`Ты ${this.roleName}! Ты знаешь, кто настоящий провидец, а не дурак... В общем это ` +
        `твоя единственная функция.\n${this.seers?.length ? this.seers.join(', ') + ' - провид' +
            (this.seers.length === 1 ? 'ец!' : 'цы.') :
            'Провидца нет!'}`
    weight = () => this.seers ? 6 : 2;
}