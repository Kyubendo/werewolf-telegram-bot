import {VillagerBase} from "./VillagerBase";
import {alivePlayersButtons} from "../../Game/playersButtons";
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
                reply_markup: alivePlayersButtons(Seer.game.players)
            }
        )
    };

    handleChoice = (chosenPlayer?: Player) => {
        console.log(chosenPlayer)
    }
}
