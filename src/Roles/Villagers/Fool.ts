import {Seer} from "./Seer";
import {findPlayer} from "../../Game/findPlayer";

export class Fool extends Seer {
    roleName = 'Дурак 🃏';
    weight = () => 4;

    handleChoice = (choice?: string) => {
        if (Math.random() >= 0.5) // 50% for right guess
            this.targetPlayer = findPlayer(choice, Fool.game.players)
        else { // And 50% for wrong guess (can show any player including Fool but excluding the right one)
            const otherPlayers = Fool.game.players.filter(player => player !== this.player);
            this.targetPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
        }
        this.choiceMsgEditText();
    }
}
