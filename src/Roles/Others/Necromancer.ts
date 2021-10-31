import {RoleBase} from "../Abstract/RoleBase";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";

export class Necromancer extends RoleBase {
    roleName = 'Некромант ⚰';
    startMessageText = () => 'Ночью ты можешь выбрать роль мертвого для оставшейся части игры. ' +
        'Но выбирай мудро, так как ты не можешь выиграть как Некромант.'
    weight = () => 3;

    nightActionDone = false

    action = () => {
        const deadPlayers = Necromancer.game.players
            .filter(player => !player.isAlive);
        if (!deadPlayers.length) return
        Necromancer.game.bot.sendMessage(
            this.player.id,
            'Чью роль ты хочешь взять?',
            {
                reply_markup: generateInlineKeyboard(deadPlayers)
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    actionResolve = () => {
        if (!this.targetPlayer?.role) return;

        this.player.role = this.targetPlayer.role.createThisRole(this.player, this.player.role);

        this.targetPlayer = undefined;
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Necromancer.game.players);
        this.choiceMsgEditText();
        this.doneNightAction()
    }
}