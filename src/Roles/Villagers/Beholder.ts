import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Fool, RoleBase, Seer} from "../index";

export class Beholder extends RoleBase {
    roleName = 'Очевидец 👁';
    private seers = (): string[] => Beholder.game.players
        .filter(player => player.role instanceof Seer && !(player.role instanceof Fool))
        .map(player => highlightPlayer(player))

    stealMessage = this.seers().length === 0
            ? '\nПровидца нет!'
            : this.seers().length === 1
                ? `\n${this.seers()[0]} может спасти народ, защищай его!`
                : '\nПровидцы: ' + this.seers().join(', ');

    startMessageText = () => `Ты знаешь, кто настоящий провидец, а не дурак... В общем это ` +
        'твоя единственная функция.' + this.stealMessage;
    weight = () => this.seers().length ? 4.5 : 2;
}