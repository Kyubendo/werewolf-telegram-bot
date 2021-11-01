import {Seer} from "./Seer";
import {findPlayer} from "../../Game/findPlayer";
import {Player} from "../../Player/Player";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {randomElement} from "../../Utils/randomElement";
import {DeathType} from "../Abstract/RoleBase";

export class Fool extends Seer {
    roleName = 'Дурак 🃏';
    weight = () => 4;

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Fool.game.players);
        this.choiceMsgEditText();
        if (Math.random() >= 0.5) { // 50% for right guess
            const otherPlayers = Fool.game.players.filter(player => player !== this.player && player.isAlive);
            this.targetPlayer = randomElement(otherPlayers);
        }
        this.doneNightAction()
    }

    handleDeath(killer?: Player, type?: DeathType): boolean {
        this.player.isAlive = false;
        Fool.game.bot.sendMessage(
            Fool.game.chatId,
            'День начался с печальных новостей. Всем известный Провид... ' +
            `Так, стоп! Это же никакой не Провидец! Он... *${this.roleName}*!  ` +
            `Покойся не с миром, ${highlightPlayer(this.player)}...`,
        )

        killer?.role?.killMessageDead && Fool.game.bot.sendMessage(
            this.player.id,
            killer?.role?.killMessageDead
        )
        this.player.isAlive = false;
        return true;
    }
}
