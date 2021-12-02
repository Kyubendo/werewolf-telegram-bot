import {findPlayer} from "../../Game/findPlayer";
import {Arsonist, Beholder, RoleBase} from "../index";
import {highlightPlayer} from "../../Utils/highlightPlayer";

export class Undertaker extends RoleBase {
    roleName = 'Гробовщик ⚰';
    startMessageText = () => 'Тебе до смерти надоела твоя работа... ' +
        'Ночью ты можешь забрать себе роль одного из мертвецов и выиграть за его команду! Помни, что ты не можешь ' +
        `выиграть как ${this.roleName}.`
    weight = () => 0;

    nightActionDone = false

    action = () => {
        const deadPlayersRoles: RoleBase[] = Undertaker.game.players
            .filter(player => !player.isAlive && player.role)
            .map(p => p.role)
            .filter((r): r is RoleBase => !!r)

        if (!deadPlayersRoles.length) {
            this.doneNightAction();
            return;
        }
        Undertaker.game.bot.sendMessage(
            this.player.id,
            'Какую роль ты хочешь взять?',
            {
                reply_markup: {
                    inline_keyboard: deadPlayersRoles
                        .map(r => [{
                            text: r.roleName,
                            callback_data: JSON.stringify({type: 'role', choice: r.player.id})
                        }])
                }
            }
        ).then(msg => this.actionMsgId = msg.message_id)
    }

    actionResolve = async () => {
        if (!this.targetPlayer?.role) return;

        this.player.role = this.targetPlayer.role.createThisRole(this.player, this.player.role);

        await Undertaker.game.bot.sendMessage(
            this.player.id,
            `Ты должен похоронить ${highlightPlayer(this.targetPlayer)}, ` +
            `но когда ты видишь такой прекрасный труп ты не можешь не задуматься, ` +
            `какую жизнь прожило это тело... жизнь, ` +
            `которой у тебя никогда не было, ведь ты без конца копал могилы в этом адском селе. ` +
            `У тебя просто не поднимается лопата его похоронить. ` +
            `Да и работать гробовщиком тебе уже осточертело... Пора увольняться и начинать новую жизнь! ` +
            `В общем, теперь ты ${this.player.role.roleName}.`
        )

        await this.player.role.sendAlliesMessage?.(true);

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

    choiceMsgEditText = () => RoleBase.game.bot.editMessageText(
        `Выбор принят — ${this.targetPlayer
            ? this.targetPlayer.role?.roleName
            : 'Пропустить'}.`,
        {
            message_id: this.actionMsgId,
            chat_id: this.player.id,
        }
    )
}