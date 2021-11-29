import {RoleBase} from "../Abstract/RoleBase";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {SerialKiller} from "./SerialKiller";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Beauty} from "../Villagers/Beauty";
import {Doppelganger} from "./Doppelganger";
import {Mason} from "../Villagers/Mason";
import {Wolf} from "../WolfTeam/Wolf";

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

        if (!this.targetPlayer.isAlive) {
            await Thief.game.bot.sendMessage(
                this.player.id,
                `Ты попытался украсть роль у ${highlightPlayer(this.targetPlayer)}, но он(а) уже труп!`
            )
            return;
        }

        if (this.targetPlayer.role instanceof SerialKiller) {
            this.player.isAlive = false;

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
            this.player.loveBind(this.targetPlayer);
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

            const targetStealMessage: string | false | undefined = this.targetPlayer?.role?.stealMessage?.();

            await Thief.game.bot.sendMessage(
                this.player.id,
                `Успех! Ты украль роль у ${highlightPlayer(this.targetPlayer)}! ` +
                `Теперь ты *${this.player.role?.roleName}*!`
            )

            targetStealMessage && await Thief.game.bot.sendMessage(
                this.player.id,
                targetStealMessage
            )

            if (this.targetPlayer) this.targetPlayer.role = new Thief(this.targetPlayer, this.targetPlayer.role);

            if (this.player.role instanceof Mason) {
                await Thief.game.bot.sendMessage(
                    this.player.id,
                    this.player.role.showOtherMasonPlayers()
                )

                this.player.role.findOtherMasonPlayers().forEach(masonPlayer => {
                        this.targetPlayer && Thief.game.bot.sendMessage(
                            masonPlayer.id,
                            `Странно, ${highlightPlayer(this.player)} пришёл на собрание ` +
                            `каменщиков вместо ${highlightPlayer(this.targetPlayer)}!`
                        )
                    }
                )
            } else if (this.player.role instanceof Wolf) {
                await Thief.game.bot.sendMessage(
                    this.player.id,
                    this.player.role.showOtherWolfPlayers()
                )

                this.player.role.findOtherWolfPlayers().forEach(wolfPlayer => { // maybe add exception for the targetPlayer
                    this.targetPlayer && Thief.game.bot.sendMessage(
                        wolfPlayer.id,
                        `Странно, ${highlightPlayer(this.targetPlayer)} решил стать веганом, ` +
                        `а ${highlightPlayer(this.player)} протяжно выл в ночи и щёлкал зубами! ` +
                        `${highlightPlayer(this.player)} теперь волк.`
                    )
                })
            }

            await Thief.game.bot.sendMessage(
                this.targetPlayer.id,
                `Что-то пропало! Ах да! Твоя роль! Теперь у тебя нет роли, и ты сам стал вором. ` +
                `Укради роль у кого-нибудь.` // GIF
            )
        }
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Thief.game.players);
        this.choiceMsgEditText().then(this.doneNightAction)
    }
}
