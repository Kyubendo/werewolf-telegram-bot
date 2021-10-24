import {Villager} from "./Villager";
import {Seer} from "./Seer";
import {Fool} from "./Fool";
import {Player} from "../../Player/Player";

export class Beholder extends Villager {
    roleName = 'Очевидец 👁';
    private seers?: Player[] = Beholder.game.players
        .filter(player => player.role instanceof Seer && !(player.role instanceof Fool));
    startMessageText = `Ты ${this.roleName}! Ты знаешь, кто настоящий провидец, а не дурак... В общем это ` +
        `твоя единственная функция. ${this.seers ? this.seers.join(', ') + ' - провид' +
            (this.seers.length === 1 ? 'ец!' : 'цы') :
            'Провидца нет!'}`
    weight = () => this.seers ? 6 : 2;
}