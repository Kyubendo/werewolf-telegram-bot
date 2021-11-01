import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {SerialKiller} from "../Others/SerialKiller";
import {Wolf} from "../WolfTeam/Wolf";
import {Player} from "../../Player/Player";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {DeathType, RoleBase} from "../Abstract/RoleBase";
import {Beauty} from "./Beauty";

export class Harlot extends RoleBase {
    roleName = "Блудница 💋";
    roleIntroductionText = () => `Ах ты ${this.roleName}!\n`
    startMessageText = () => `Ты можешь пойти к кому-то ночью и хорошо провести время... \n` +
        'Но, если зло выберет того, к кому ты пошла, вы оба умрете! А если волки выберут тебя, а дома ' +
        'тебя не будет, ты останешься жить, логично...';
    weight = () => 6;

    nightActionDone = false

    action = () => {
        this.targetPlayer = undefined;

        Harlot.game.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь навестить?',
            {
                reply_markup: generateInlineKeyboard(Harlot.game.players
                    .filter(player => player !== this.player && player.isAlive))
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    actionResolve = () => {
        if (!this.targetPlayer?.role) return;

        if (this.targetPlayer.role instanceof Wolf || this.targetPlayer.role instanceof SerialKiller) {
            this.onKilled(this.targetPlayer);
        } else if (this.targetPlayer.role instanceof Beauty && this.targetPlayer.lover !== this.player) {
            this.loveBind(this.targetPlayer);
        } else {
            if (this.targetPlayer) {
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
        }
    }

    actionResult = () => {
        if (!this.targetPlayer?.role) return;

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

    originalHandleDeath = (killer?: Player, type?: DeathType): boolean => {
        if (killer?.role instanceof Wolf) { // Если волк пытается убить шлюху
            if (this.targetPlayer?.role instanceof Wolf) { // Убивает, если её целью является любой из волков
                this.player.isAlive = false;

                Harlot.game.bot.sendMessage(
                    Harlot.game.chatId,
                    `${highlightPlayer(this.player)} проскользнула в не тот дом прошлой ночью!  ` +
                    'Останки распутной жительницы были найдены пригвожденными к дверям цверкви... Как жалко :(')
                return true;
            } else { // Не убивает, если её целью является не волк
                this.targetPlayer && Harlot.game.bot.sendMessage( // Переделать на много волков
                    this.targetPlayer.id, // Сообщение волку, если он пошёл в шлюху, а её не было дома
                    `Странно... ${this.targetPlayer?.role?.targetPlayer} не была дома! ` +
                    `Нет ужина для тебя сегодня...`,
                )
                return false;
            }
        } else if (killer?.role instanceof Harlot) {
            this.player.isAlive = false;
            return true;
        }
        return this.defaultHandleDeath(killer, type);
    }
}