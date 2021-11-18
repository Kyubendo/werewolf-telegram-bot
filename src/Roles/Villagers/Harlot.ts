import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {SerialKiller} from "../Others/SerialKiller";
import {Wolf} from "../WolfTeam/Wolf";
import {Player} from "../../Player/Player";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {DeathType} from "../../Game";
import {Beauty} from "./Beauty";
import {RoleBase} from "../index";

export class Harlot extends RoleBase {
    roleName = "Блудница 💋";
    roleIntroductionText = () => `Ах ты ${this.roleName}!\n`
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
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    saved: boolean = true;

    actionResolve = () => {
        if (!this.targetPlayer?.role) return;

        if (this.targetPlayer.role instanceof Wolf || this.targetPlayer.role instanceof SerialKiller) {
            this.onKilled(this.targetPlayer);
            return;
        } else if (this.targetPlayer.role instanceof Beauty && this.targetPlayer.lover !== this.player) {
            this.player.loveBind(this.targetPlayer);
            return;
        } else {
            const currentTargetHandleDeath = this.targetPlayer.role.handleDeath.bind(this.targetPlayer.role);
            this.targetPlayer.role.handleDeath = (killer?: Player, type?: DeathType) => {
                if (this.targetPlayer) {
                    this.saved = true;
                    this.onKilled(killer, 'harlotDeath')
                }

                return currentTargetHandleDeath(killer, type);
            }
        }

        this.saved = false;
    }

    actionResult = () => {
        if (!this.targetPlayer?.role || this.saved) return;

        Harlot.game.bot.sendMessage(
            this.player.id,
            `Ты сразу поняла, что ${highlightPlayer(this.targetPlayer)} не волк и ` +
            `не серийный убийца, потому что ночь была слишком хороша...`,
        )
        Harlot.game.bot.sendMessage(
            this.targetPlayer.id,
            'Было темно, поэтому ты ничего не помнишь, но этой ночью кто-то оседлал тебя... ' +
            'И вы оба хорошо провели время!' // GIF
        )
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Harlot.game.players);
        this.choiceMsgEditText();
        this.doneNightAction()
    }

    handleDeath(killer?: Player, type?: DeathType): boolean {
        if (type === 'harlotDeath' && killer && this.targetPlayer) {
            const harlotPlayer = this.player;
            if (killer.role instanceof Wolf) {
                RoleBase.game.bot.sendMessage(
                    RoleBase.game.chatId,
                    `${highlightPlayer(harlotPlayer)} проскользнула ` +
                    `в дом ${highlightPlayer(this.targetPlayer)}, ` +
                    'готовая чуть повеселиться и снять стресс. Но вместо этого она находит волка, ' +
                    `пожирающего ${highlightPlayer(this.targetPlayer)}! ` +
                    `Волк резко прыгает на ${highlightPlayer(harlotPlayer)}... ` +
                    `*${harlotPlayer.role?.roleName}* ${highlightPlayer(harlotPlayer)} мертва.`,
                )
            } else if (killer.role instanceof SerialKiller) {
                RoleBase.game.bot.sendMessage(
                    RoleBase.game.chatId,
                    `*${harlotPlayer.role?.roleName}* ${highlightPlayer(harlotPlayer)} проникла в дом ` +
                    `${highlightPlayer(this.player)}, но какой-то незнакомец уже потрошит внутренности ` +
                    `${highlightPlayer(this.player)}! ` +
                    `*${killer.role.roleName}* решил развлечься с ${highlightPlayer(harlotPlayer)}, ` +
                    `прежде чем взять сердце к себе в коллекцию!`,
                )
            }
        } else if (killer?.role instanceof Wolf && !type) {
            if (this.targetPlayer?.role instanceof Wolf) {
                Harlot.game.bot.sendMessage(
                    Harlot.game.chatId,
                    `${highlightPlayer(this.player)} проскользнула в не тот дом прошлой ночью!  ` +
                    'Останки распутной жительницы были найдены пригвожденными к дверям цверкви... Как жалко :(')
            } else {
                this.targetPlayer && Harlot.game.bot.sendMessage(
                    killer.id,
                    `Странно... ${highlightPlayer(this.player)} не была дома! ` +
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
