import {Seer} from "./Seer";
import {findPlayer} from "../../Game/findPlayer";
import {Player} from "../../Player/Player";
import {highlightPlayer} from "../../Utils/highlightPlayer";

export class Fool extends Seer {
    roleName = 'Дурак 🃏';
    weight = () => 4;

    handleChoice = (choice?: string) => {
        if (Math.random() >= 0.5) // 50% for right guess
            this.targetPlayer = findPlayer(choice, Fool.game.players)
        else {
            const otherPlayers = Fool.game.players.filter(player => player !== this.player && player.isAlive);
            this.targetPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
        }
        this.choiceMsgEditText();
    }

    handleDeath(killer?: Player): boolean {
        this.player.isAlive = false;
        Fool.game.bot.sendMessage(
            Fool.game.chatId,
            'День начался с печальных новостей. Всем известный Провид... ' +
            `Так, стоп! Это же никакой не Провидец! Он... ${this.roleName}!  ` +
            `Покойся не с миром, ${highlightPlayer(this.player)}...`,
            {
                parse_mode: 'Markdown'
            }
        )
        return true;
    }
}
