import {RoleBase} from "../Abstract/RoleBase";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {rolesThatNeedStealMessage} from "../../Utils/teams";
import {Mason} from "../Villagers/Mason";
import {Wolf} from "../WolfTeam/Wolf";

export class Necromancer extends RoleBase {
    roleName = 'Некромант ⚰';
    startMessageText = () => 'Ночью ты можешь выбрать роль мертвого для оставшейся части игры. ' +
        'Но выбирай мудро, так как ты не можешь выиграть как Некромант.'
    weight = () => 0;

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
        ).then(msg => this.actionMsgId = msg.message_id)
    }

    actionResolve = async () => {
        if (!this.targetPlayer?.role) return;

        this.player.role = this.targetPlayer.role.createThisRole(this.player, this.player.role);

        await rolesThatNeedStealMessage.forEach(r => this.player.role instanceof r && Necromancer.game.bot
            .sendMessage(
                this.player.id,
                this.player.role.stealMessage()
            ))

        if (this.player.role instanceof Mason)
            this.player.role.findOtherMasonPlayers().forEach(masonPlayer => masonPlayer.role?.newMemberNotification)
        else if (this.player.role instanceof Wolf)
            this.player.role.findOtherWolfPlayers().forEach(wolfPlayer => wolfPlayer.role?.newMemberNotification)
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Necromancer.game.players);
        this.choiceMsgEditText();
        this.doneNightAction()
    }
}