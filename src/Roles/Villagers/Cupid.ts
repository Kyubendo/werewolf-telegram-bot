import {RoleBase} from "../index";
import {Player} from "../../Game";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {specialConditionCupid} from "../../Utils/specialConditionTypes";
import {randomElement} from "../../Utils/randomElement";

export class Cupid extends RoleBase {
    readonly roleName = 'Купидон 🏹';

    readonly startMessageText = () => "Свяжи голубков.";

    readonly weight = () => 2;

    nightActionDone = false

    specialCondition: specialConditionCupid = {loversBound: false}

    targetPlayer2?: Player

    targets = () => Cupid.game.players.filter(player => player !== this.targetPlayer && player.isAlive)

    action = () => {
        if (!this.specialCondition.loversBound) this.loveArrowChoice()
    }

    loveArrowChoice = () => Cupid.game.bot.sendMessage(
        this.player.id,
        'Кого ты хочешь связать узами вечной любви?',
        {
            reply_markup: generateInlineKeyboard(this.targets(), false)
        }
    ).then(msg => this.choiceMsgId = msg.message_id)

    handleChoice = (choice?: string) => {
        if (this.targetPlayer) {
            this.targetPlayer2 = findPlayer(choice, Cupid.game.players);
            this.targetPlayer2 && RoleBase.game.bot.editMessageText(
                `Выбор принят — ${highlightPlayer(this.targetPlayer2)}.`,
                {message_id: this.choiceMsgId, chat_id: this.player.id}
            ).then(this.doneNightAction)
        } else {
            this.targetPlayer = findPlayer(choice, Cupid.game.players)
            this.choiceMsgEditText().then(this.loveArrowChoice)
        }
    }

    actionResolve = async () => {
        this.specialCondition.loversBound = true
        this.stealMessage = 'Однако, ты видишь, что в колчане кончались любовные стрелы.'
        if (!this.targetPlayer2) {
            if (!this.targetPlayer) this.targetPlayer = randomElement(this.targets())
            this.targetPlayer2 = randomElement(this.targets())
            await Cupid.game.bot.editMessageText(
                `Ты не успел сделать выбор, так что высшие силы сделали выбор за тебя. `
                + `${highlightPlayer(this.targetPlayer)} и ${highlightPlayer(this.targetPlayer2)} `
                + `теперь связаны любовью.`,
                {
                    chat_id: this.player.id,
                    message_id: this.choiceMsgId
                }
            )
        }
        this.targetPlayer?.loveBind(this.targetPlayer2)
    }
}
