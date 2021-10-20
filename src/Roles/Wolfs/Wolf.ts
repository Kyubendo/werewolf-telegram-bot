import {WolfBase} from "./WolfBase";
import {alivePlayersButtons} from "../../Game/playersButtons";
import {Player} from "../../Player/Player";

export class Wolf extends WolfBase {
    roleName = 'Wolf';
    startMessageText = 'Ты волк. Скушай всё село.';
    weight = 10;

    nightAction = () => {
        Wolf.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь съесть?',
            {
                reply_markup: alivePlayersButtons(Wolf.game.players, this.player)
            }
        )
    }

    handleChoice = (chosenPlayer?: Player) => {
        console.log(chosenPlayer);
    }
}
