import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Beauty, Doppelganger, RoleBase, SerialKiller} from "../index";

export class Thief extends RoleBase {
    roleName = "Вор 😈";
    startMessageText = () => `Тебе нравится воровать жизни людей. Каждую ночь можно выбрать того, ` +
        `у кого хочешь украсть. Если тебе повезет, тебе удастся украсть его роль, и вместо этого он станет вором!`
    weight = () => -4; // change?

    nightActionDone = false

    action = () => {
        Thief.game.bot.sendMessage(this.player.id,
            'Чью роль ты хочешь украсть?',
            {
                reply_markup: generateInlineKeyboard(Thief.game.players.filter(p => p !== this.player && p.isAlive))
            }
        ).then(msg => this.actionMsgId = msg.message_id)
    }

    actionResolve = async () => {
        if (!this.targetPlayer?.role) return;

        if (!this.targetPlayer.isAlive)
            await Thief.game.bot.sendMessage(
                this.player.id,
                `Ты попытался украсть роль у ${highlightPlayer(this.targetPlayer)}, но он(а) уже труп!`
            )
        else if (this.targetPlayer.role instanceof SerialKiller) {
            this.player.isAlive = false; // change later to thiefCameToSerialKiller Thief's handleDeath

            await Thief.game.bot.sendMessage(
                Thief.game.chatId,
                `*${this.roleName}* — ${highlightPlayer(this.player)} решил испытать удачу и попытался ` +
                `отобрать у серийного убийцы ножи. Плохая идея, тот оказался очень нервным и жадным.`,
            )

            await Thief.game.bot.sendMessage(
                this.player.id,
                `Ты попытался украсть роль… но не у серийного убийцы же красть! Ты мёртв!`,
            )
        } else if (this.targetPlayer.role instanceof Beauty && this.targetPlayer.lover !== this.player) {
            await this.player.loveBind(this.targetPlayer);
        } else if (this.targetPlayer.role instanceof Doppelganger) {
            await Thief.game.bot.sendMessage(
                this.player.id,
                'Ты попытался украсть роль... ' +
                `но даже лучший ${this.roleName} не в силах повторить такое искуство. ` +
                `Ты понимаешь, что это *${this.targetPlayer.role}*, наследник легендарных Метаморфов, ` +
                'и его роль украсть не удастся. По крайней мере пока...'
            )
        } else if (this.player.role) {
            this.player.role = this.targetPlayer.role
                .createThisRole(this.player, this.player.role);
            this.player.role.specialCondition = this.targetPlayer.role.specialCondition;

            if (this.targetPlayer) this.targetPlayer.role = new Thief(this.targetPlayer, this.targetPlayer.role);

            await Thief.game.bot.sendMessage(
                this.targetPlayer.id,
                `Что-то пропало! Ах да! Твоя роль! Теперь у тебя нет роли, и ты сам стал вором. ` +
                `Укради роль у кого-нибудь.` // GIF
            )

            const stealMessageText: string | false | undefined = this.player?.role?.stealMessage?.();

            await Thief.game.bot.sendMessage(
                this.player.id,
                `Успех! Ты украль роль у ${highlightPlayer(this.targetPlayer)}! ` +
                `Теперь ты *${this.player.role?.roleName}*!`
            )

            stealMessageText && await Thief.game.bot.sendMessage(
                this.player.id,
                stealMessageText
            )

            this.player.role.getAlliesMessage && await Thief.game.bot.sendMessage(
                this.player.id,
                this.player.role.getAlliesMessage(true)
            )
        }
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Thief.game.players);
        this.choiceMsgEditText().then(this.doneNightAction)
    }
}
