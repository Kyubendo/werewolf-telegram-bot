import {RoleBase} from "../RoleBase";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {SerialKiller} from "./SerialKiller";
import {highlightPlayer} from "../../Utils/highlightPlayer";

export class Thief extends RoleBase {
    roleName = "Вор 😈";
    startMessageText = `Ты ${this.roleName}! Тебе нравится воровать жизни людей. Каждую ночь можно выбрать того, ` +
        `у кого хочешь украсть. Если тебе повезет, тебе удастся украсть его роль, и вместо этого он станет вором!`
    weight = () => -4; // change?

    action = () => {
        if (Thief.game.stage !== 'night') return;
        Thief.game.bot.sendMessage(this.player.id,
            'Чью роль ты хочешь украсть?',
            {
                reply_markup: generateInlineKeyboard(Thief.game.players.filter(player => player !== this.player &&
                    player.isAlive))
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    actionResolve = () => {
        if (Thief.game.stage !== 'night' || !this.targetPlayer?.role) return;

        if (!this.targetPlayer.isAlive) {
            Thief.game.bot.sendMessage(
                this.player.id,
                `Ты попытался украсть роль у ${highlightPlayer(this.targetPlayer)}, но он труп!`
            )
            return;
        }

        if (this.targetPlayer.role instanceof SerialKiller) {
            this.player.isAlive = false;

            Thief.game.bot.sendMessage(
                Thief.game.chatId,
                `${this.roleName} ${highlightPlayer(this.player)} решил испытать удачу и попытался ` +
                `отобрать у серийного убийцы ножи. Плохая идея, тот оказался очень нервным и жадным.`,
                {
                    parse_mode: 'Markdown'
                }
            )

            Thief.game.bot.sendMessage(
                this.player.id,
                `Ты попытался украсть роль… но не у серийного убийцы же красть! Ты мёртв!`,
            )
        } else {
            [this.player.role, this.targetPlayer.role] = [this.targetPlayer.role, this.player.role];

            Thief.game.bot.sendMessage(
                this.player.id,
                `Успех! Ты украль роль у ${highlightPlayer(this.targetPlayer)}! ` +
                `Теперь ты ${this.player.role.roleName}!`,
                {
                    parse_mode: 'Markdown'
                }
            )

            Thief.game.bot.sendMessage(
                this.targetPlayer.id,
                `Что-то пропало! Ах да! Твоя роль! Теперь у тебя нет роли, и ты сам стал вором. ` +
                `Укради роль у кого-нибудь.`
            )
        }
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Thief.game.players);
        this.choiceMsgEditText();
    }

}