import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {Arsonist, Beholder, RoleBase} from "../index";
import {highlightPlayer} from "../../Utils/highlightPlayer";

export class Undertaker extends RoleBase {
    roleName = 'Гробовщик ⚰';
    startMessageText = () => 'Ночью ты можешь выбрать роль мертвого для оставшейся части игры. ' +
        `Но выбирай мудро, так как ты не можешь выиграть как ${this.roleName}.`
    weight = () => 0;

    nightActionDone = false

    action = () => {
        const deadPlayers = Undertaker.game.players
            .filter(player => !player.isAlive);
        if (!deadPlayers.length) {
            this.doneNightAction();
            return;
        }
        Undertaker.game.bot.sendMessage(
            this.player.id,
            'Чью роль ты хочешь взять?',
            {
                reply_markup: generateInlineKeyboard(deadPlayers)
            }
        ).then(msg => this.actionMsgId = msg.message_id)
    }

    actionResolve = async () => {
        if (!this.targetPlayer?.role) return;

        this.player.role = this.targetPlayer.role.createThisRole(this.player, this.player.role);

        await Undertaker.game.bot.sendMessage(
            this.player.id,
            `Ты должен похоронить ${highlightPlayer(this.targetPlayer)}, ` +
            `но когда ты видишь такой прекрасный труп ты не можешь задуматься, ` +
            `какую жизнь прожило это тело... жизнь, ` +
            `которой у тебя никогда не было, ведь ты без конца копал могилы в этом адском селе. ` +
            `У тебя просто не поднимается лопата его похоронить. ` +
            `Да и работать гробовщиком тебе уже осточертело... Пора увольняться и начинать новую жизнь! ` +
            `В общем, теперь ты ${this.player.role.roleName}.`
        )

        this.player.role.getAlliesMessage && await Undertaker.game.bot.sendMessage(
            this.player.id,
            this.player.role.getAlliesMessage(true)
        )

        if (this.player.role instanceof Arsonist || this.player.role instanceof Beholder)
            await Undertaker.game.bot.sendMessage(
                this.player.id,
                this.player.role.stealMessage()
            )
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Undertaker.game.players);
        this.choiceMsgEditText();
        this.doneNightAction()
    }
}