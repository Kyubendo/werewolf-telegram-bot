import {VillagerBase} from "./VillagerBase";
import {playersButtons} from "../../Game/playersButtons";
import {Player} from "../../Player/Player";

export class Seer extends VillagerBase {
    roleName = 'Провидец';
    startMessageText = 'Ты Провидец! Каждую ночь ты можешь выбрать человека, чтобы "увидеть" его роль.  ';
    weight = 7;

    nightAction = () => {
        Seer.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь посмотреть?',
            {
                reply_markup: playersButtons(Seer.game.players, true, this.player)
            }
        )
    };

    handleChoice = (chosenPlayer?: Player) => {
        console.log(chosenPlayer)
    }
}
