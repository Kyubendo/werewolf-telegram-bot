import {WolfBase} from "./WolfBase";
import {playersButtons} from "../../Game/playersButtons";
import {Player} from "../../Player/Player";

export class Wolf extends WolfBase {
    roleName = 'Wolf';
    startMessageText = 'Ты волк. Скушай всё село.';
    weight = -10;

    nightAction = () => {
        Wolf.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь съесть?',
            {
                reply_markup: playersButtons(Wolf.game.players, true, this.player)
            }
        )
    }

    handleChoice = (chosenPlayer?: Player) => {
        console.log(chosenPlayer);
    }
}
