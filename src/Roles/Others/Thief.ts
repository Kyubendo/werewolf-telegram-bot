import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {playerLink} from "../../Utils/playerLink";
import {Beauty, Cowboy, Doppelganger, RoleBase, SerialKiller} from "../index";
import {DeathType} from "../Abstract/RoleBase";
import {Player} from "../../Player/Player";

export class Thief extends RoleBase {
    roleName = "Вор 😈";
    startMessageText = () => `Тебе нравится воровать жизни людей. Каждую ночь можно выбрать того, ` +
        `у кого хочешь украсть. Если тебе повезет, тебе удастся украсть его роль, и вместо этого он станет вором!`
    weight = () => -4;

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
                `Ты попытался украсть роль у ${playerLink(this.targetPlayer)}, но он(а) уже труп!`
            )
        else if (this.targetPlayer.role instanceof SerialKiller)
            await this.handleDeath(this.targetPlayer, 'thiefCameToSerialKiller')
        else if (this.targetPlayer.role instanceof Cowboy && Math.random() < .5)
            await this.handleDeath(this.targetPlayer, 'thiefCameToCowboy');
        else if (this.targetPlayer.role instanceof Beauty && this.targetPlayer.lover !== this.player) {
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

            this.targetPlayer.role instanceof Cowboy && await Thief.game.bot.sendMessage(
                this.targetPlayer.id,
                `Посреди ночи, в попытке украсть твоё сомбреро, к тебе вломился ворюга. ` +
                `Но ты был готов к такой ситуации и умело связал взломщика своим лассо. ` +
                `Пока ты думал, что сделать со связанным грабилем, ` +
                `он украл твоё лассо! Теперь он ${this.roleName}.`
            )

            this.targetPlayer.role = new Thief(this.targetPlayer, this.targetPlayer.role);

            await Thief.game.bot.sendMessage(
                this.targetPlayer.id,
                `Что-то пропало! Ах да! Твоя роль! Теперь у тебя нет роли, и ты сам стал вором. ` +
                `Укради роль у кого-нибудь.` // GIF
            )

            const stealMessageText: string | false | undefined = this.player?.role?.stealMessage?.();

            await Thief.game.bot.sendMessage(
                this.player.id,
                `Успех! Ты украль роль у ${playerLink(this.targetPlayer)}! ` +
                `Теперь ты *${this.player.role?.roleName}*!`
            )

            stealMessageText && await Thief.game.bot.sendMessage(
                this.player.id,
                stealMessageText
            )

            await this.player.role.sendAlliesMessage?.(true);
        }
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Thief.game.players);
        this.choiceMsgEditText().then(this.doneNightAction)
    }

    async handleDeath(killer?: Player, type?: DeathType): Promise<boolean> {
        if (type === 'thiefCameToCowboy') {
            this.player.isAlive = false;
            await Thief.game.bot.sendMessage(
                Thief.game.chatId,
                `${playerLink(this.player, true)} решил испытать удачу и попытался ` +
                `отобрать у ковбоя его кольт. Но реакция наездника дала о себе знать. ` +
                `Теперь у вора дыра между глаз.`,
            )
            await Thief.game.bot.sendAnimation(
                this.player.id,
                'https://media.giphy.com/media/hMwTGsex6CxOhCjnmf/giphy.gif',
                {
                    caption: 'Ты попытался украсть роль у ковбоя, но всё, ' +
                        'на что ковбой сегодня расщедрился — это куля в лоб. Ты мёртв.'
                }
            )
        } else if (type === 'thiefCameToSerialKiller') {
            this.player.isAlive = false;
            await Thief.game.bot.sendMessage(
                Thief.game.chatId,
                `*${this.roleName}* — ${playerLink(this.player)} решил испытать удачу и попытался ` +
                `отобрать у серийного убийцы ножи. Плохая идея, тот оказался очень нервным и жадным.`,
            )
            await Thief.game.bot.sendAnimation(
                this.player.id,
                'https://media.giphy.com/media/MdHPWgbGDsroZ7BHk6/giphy.gif',
                {
                    caption: `Ты попытался украсть роль… но не у серийного убийцы же красть! Ты мёртв!`
                }
            )
        }
        return super.handleDeath(killer, type);
    }
}
