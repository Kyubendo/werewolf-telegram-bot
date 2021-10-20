import {Villager} from "./Villager";
import {playersButtons} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {Lycan} from "../Wolfs/Lycan";

export class Seer extends Villager {
    roleName = 'Провидец';
    startMessageText = 'Ты Провидец! Каждую ночь ты можешь выбрать человека, чтобы "увидеть" его роль.  ';
    weight = () => 7;

    action = () => {
        if (Seer.game.stage !== 'night') return;
        Seer.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь посмотреть?',
            {
                reply_markup: playersButtons(Seer.game.players, true, this.player)
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    };

    actionResolve = () => {
        if (Seer.game.stage !== 'night' || !this.targetPlayer?.role) return;
        let roleName;

        if (this.targetPlayer.role instanceof Lycan)
            roleName = 'Селянин 👱';
        //else if (this.targetPlayer.role instanceof WolfMan)
        else
            roleName = this.targetPlayer.role.roleName;

        Seer.bot.sendMessage(
            this.player.id,
            `Ты видишь, что ${this.targetPlayer.name} это ${roleName}!`
        )
        this.targetPlayer = undefined
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Seer.game.players)
        if (!this.targetPlayer) return;
        this.choiceMsgEditText();
    }
}
