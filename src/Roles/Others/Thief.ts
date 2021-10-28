import {RoleBase} from "../Abstract/RoleBase";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {SerialKiller} from "./SerialKiller";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Beauty} from "../Villagers/Beauty";

export class Thief extends RoleBase {
    roleName = "Вор 😈";
    startMessageText = () => `Тебе нравится воровать жизни людей. Каждую ночь можно выбрать того, ` +
        `у кого хочешь украсть. Если тебе повезет, тебе удастся украсть его роль, и вместо этого он станет вором!`
    weight = () => -4; // change?

    action = () => {
        Thief.game.bot.sendMessage(this.player.id,
            'Чью роль ты хочешь украсть?',
            {
                reply_markup: generateInlineKeyboard(Thief.game.players.filter(player => player !== this.player &&
                    player.isAlive))
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    actionResolve = () => {
        if (!this.targetPlayer?.role) return;
        if (!this.targetPlayer.isAlive) {
            Thief.game.bot.sendMessage(
                this.player.id,
                `Ты попытался украсть роль у ${highlightPlayer(this.targetPlayer)}, но он(а) уже труп!`
            )
            return;
        }

        if (this.targetPlayer.role instanceof SerialKiller) {
            this.player.isAlive = false;

            Thief.game.bot.sendMessage(
                Thief.game.chatId,
                `*${this.roleName}* — ${highlightPlayer(this.player)} решил испытать удачу и попытался ` +
                `отобрать у серийного убийцы ножи. Плохая идея, тот оказался очень нервным и жадным.`,
            )

            Thief.game.bot.sendMessage(
                this.player.id,
                `Ты попытался украсть роль… но не у серийного убийцы же красть! Ты мёртв!`,
            )
        } else if (this.targetPlayer.role instanceof Beauty) {
            this.loveBind(this.targetPlayer);
        } else if (this.player.role) {
            this.player.role = this.targetPlayer.role.createThisRole(this.player, this.player.role);

            this.targetPlayer.role = new Thief(this.targetPlayer, this.targetPlayer.role);

            Thief.game.bot.sendMessage(
                this.player.id,
                `Успех! Ты украль роль у ${highlightPlayer(this.targetPlayer)}! ` +
                `Теперь ты *${this.player.role?.roleName}*!`
            )

            Thief.game.bot.sendMessage(
                this.targetPlayer.id,
                `Что-то пропало! Ах да! Твоя роль! Теперь у тебя нет роли, и ты сам стал вором. ` +
                `Укради роль у кого-нибудь.` // GIF
            )

            this.targetPlayer = undefined;
        }

        this.targetPlayer = undefined;
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Thief.game.players);
        this.choiceMsgEditText();
    }
}