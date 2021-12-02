import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {SerialKiller} from "../Others/SerialKiller";
import {Wolf} from "../WolfTeam/Wolf";
import {Player} from "../../Player/Player";
import {playerLink} from "../../Utils/playerLink";
import {DeathType} from "../../Game";
import {Beauty} from "./Beauty";
import {Arsonist, RoleBase} from "../index";

export class Harlot extends RoleBase {
    roleName = "Блудница 💋";
    roleIntroductionText = () => `Ах ты ${this.roleName}!`
    startMessageText = () => `Ты можешь пойти к кому-то ночью и хорошо провести время... \n` +
        'Но, если зло выберет того, к кому ты пошла, вы оба умрете! А если волки выберут тебя, а дома ' +
        'тебя не будет, ты останешься жить, логично...';
    weight = () => 4.5;

    nightActionDone = false

    action = () => {


        Harlot.game.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь навестить?',
            {
                reply_markup: generateInlineKeyboard(Harlot.game.players
                    .filter(player => player !== this.player && player.isAlive))
            }
        ).then(msg => this.actionMsgId = msg.message_id)
    }

    saved: boolean = true;

    actionResolve = async () => {
        if (!this.targetPlayer?.role) return;

        if (this.targetPlayer.role instanceof Wolf || this.targetPlayer.role instanceof SerialKiller) {
            await this.onKilled(this.targetPlayer);
            return;
        } else if (this.targetPlayer.role instanceof Beauty && this.targetPlayer.lover !== this.player) {
            await this.player.loveBind(this.targetPlayer);
            return;
        } else {
            const currentTargetHandleDeath = this.targetPlayer.role.handleDeath.bind(this.targetPlayer.role);
            this.targetPlayer.role.handleDeath = async (killer?: Player, type?: DeathType) => {
                if (this.targetPlayer) {
                    this.saved = true;
                    await this.onKilled(killer, 'harlotDeath')
                }

                return currentTargetHandleDeath(killer, type);
            }
        }

        this.saved = false;
    }

    actionResult = async () => {
        if (!this.targetPlayer?.role || this.saved) return;

        await Harlot.game.bot.sendAnimation(
            this.player.id,
            'https://media.giphy.com/media/XuYxt55O5WHsOtd722/giphy.gif',
            {
                caption: `Ты сразу поняла, что ${playerLink(this.targetPlayer)} не волк и ` +
                    `не серийный убийца, потому что ночь была слишком хороша...`
            }
        )
        await Harlot.game.bot.sendAnimation(
            this.targetPlayer.id,
            'https://media.giphy.com/media/Saavhnp9YYN7a/giphy.gif',
            // https://giphy.com/gifs/fallontonight-jimmy-fallon-tonight-show-babysitter-efUxm7LktwacWqDRyh
            // https://giphy.com/gifs/lloyd-saddle-BycHXN5xIY6e4
            // https://giphy.com/gifs/disney-toy-story-9Jp68LHctc8Qo
            {
                caption: 'Было темно, поэтому ты ничего не помнишь, но этой ночью кто-то оседлал тебя... ' +
                    'И вы оба хорошо провели время!'
            }
        )
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Harlot.game.players);
        this.choiceMsgEditText();
        this.doneNightAction()
    }

    async handleDeath(killer?: Player, type?: DeathType): Promise<boolean> {
        if (type === 'harlotDeath' && killer && this.targetPlayer) {
            const harlotPlayer = this.player;
            if (killer.role instanceof Wolf) {
                await RoleBase.game.bot.sendMessage(
                    RoleBase.game.chatId,
                    `${playerLink(harlotPlayer)} проскользнула ` +
                    `в дом ${playerLink(this.targetPlayer)}, ` +
                    'готовая чуть повеселиться и снять стресс. Но вместо этого она находит волка, ' +
                    `пожирающего ${playerLink(this.targetPlayer)}! ` +
                    `Волк резко прыгает на ${playerLink(harlotPlayer)}... ` +
                    `${playerLink(harlotPlayer, true)} мертва.`,
                )
            } else if (killer.role instanceof SerialKiller) {
                await RoleBase.game.bot.sendMessage(
                    RoleBase.game.chatId,
                    `${playerLink(harlotPlayer, true)} проникла в дом ` +
                    `${playerLink(this.player)}, но какой-то незнакомец уже потрошит внутренности ` +
                    `${playerLink(this.player)}! ` +
                    `*${killer.role.roleName}* решил развлечься с ${playerLink(harlotPlayer)}, ` +
                    `прежде чем взять сердце к себе в коллекцию!`,
                )
            } else if (killer.role instanceof Arsonist) {
                await RoleBase.game.bot.sendMessage(
                    RoleBase.game.chatId,
                    `${playerLink(harlotPlayer, true)} пришла развлечься к ` +
                    `${playerLink(this.player)}, но, видимо, ночь оказалось слишком горячей...` +
                    `${playerLink(harlotPlayer)} сгорела вместе с домом ${playerLink(this.player)}!`
                )
            }
        } else if (killer?.role instanceof Wolf && !type) {
            if (this.targetPlayer?.role instanceof Wolf) {
                await Harlot.game.bot.sendMessage(
                    Harlot.game.chatId,
                    `${playerLink(this.player)} проскользнула в не тот дом прошлой ночью!  ` +
                    'Останки распутной жительницы были найдены пригвожденными к дверям цверкви... Как жалко :(')
            } else {
                this.targetPlayer && await Harlot.game.bot.sendMessage(
                    killer.id,
                    `Странно... ${playerLink(this.player)} не была дома! ` +
                    `Нет ужина для тебя сегодня...`,
                )
                return false;
            }
        } else
            return super.handleDeath(killer, type);

        this.player.isAlive = false;
        return true;
    }
}
