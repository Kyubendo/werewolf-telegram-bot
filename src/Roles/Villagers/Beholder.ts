import {Seer} from "./Seer";
import {Fool} from "./Fool";
import {RoleBase} from "../Abstract/RoleBase";
import {highlightPlayer} from "../../Utils/highlightPlayer";

export class Beholder extends RoleBase {
    roleName = 'Очевидец 👁';
    private seers?: string[] = Beholder.game.players
        .filter(player => player.role instanceof Seer && !(player.role instanceof Fool))
        .map(player => highlightPlayer(player))

    startMessageText = () => `Ты знаешь, кто настоящий провидец, а не дурак... В общем это ` +
        `твоя единственная функция.\n${this.seers?.length === 0
            ? 'Провидца нет!'
            : this.seers?.length === 1
                ? `${this.seers[0]} может спасти народ, защищай его!`
                : 'Провидцы: ' + this.seers?.join(', ')}`
    weight = () => this.seers?.length ? 6 : 2;
}