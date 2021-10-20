import {VillagerBase} from "./VillagerBase";
import {alivePlayersButtons} from "../../Game/playersButtons";
import {Player} from "../../Player/Player";
import {findPlayer} from "../../Game/findPlayer";

export class Seer extends VillagerBase {
    roleName = 'Провидец';
    startMessageText = 'Ты Провидец! Каждую ночь ты можешь выбрать человека, чтобы "увидеть" его роль.  ';
    weight = 7;

    targetPlayer?: Player
    choiceMsgId?: number

    action = () => {
        if (Seer.game.stage !== 'night') return;
        Seer.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь посмотреть?',
            {
                reply_markup: alivePlayersButtons(Seer.game.players)
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    };

    actionResolve = () => {
        if (Seer.game.stage !== 'night' || !this.targetPlayer) return;
        Seer.bot.sendMessage(
            this.player.id,
            `Ты видишь, что ${this.targetPlayer.name} это ${this.targetPlayer.role?.roleName}!`
        )
        this.targetPlayer = undefined
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Seer.game.players)
        if (!this.targetPlayer) return;
        Seer.bot.editMessageText(
            `Выбор принят: ${this.targetPlayer.name}.`,
            {message_id: this.choiceMsgId, chat_id: this.player.id}
        )
    }
}
