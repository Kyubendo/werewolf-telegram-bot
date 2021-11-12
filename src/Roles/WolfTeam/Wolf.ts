import {Player} from "../../Game";
import {DeathType} from "../../Game";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Beauty, FallenAngel, GuardianAngel, RoleBase, Traitor} from "../index";

export class Wolf extends RoleBase {
    findOtherWolfPlayers = () => Wolf.game.players.filter(otherPlayer =>
        otherPlayer.isAlive
        && otherPlayer.role instanceof Wolf
        && otherPlayer !== this.player
    )

    findFallenAngelPlayers = (exceptionPlayer?: Player) => Wolf.game.players.filter(player =>
        player.isAlive
        && player.role instanceof FallenAngel
        && exceptionPlayer !== player)

    showOtherWolfPlayers(): string {
        const otherWolfPlayers = this.findOtherWolfPlayers();
        const fallenAngelPlayers = this.findFallenAngelPlayers();
        if (!(otherWolfPlayers.length + fallenAngelPlayers.length))
            return '\nНо ты один в стае, крепись.'
        return (otherWolfPlayers.length > 1
                ? '\nДругие волки: '
                : '\nТвой брат по волчьему делу — ')
            + otherWolfPlayers?.map(ally => highlightPlayer(ally)).join(', ')
            + (!fallenAngelPlayers.length
                ? ''
                : fallenAngelPlayers.length > 1
                    ? '\nПадшие ангелы: '
                    : '\nПадший ангел — ')
            + fallenAngelPlayers.map(fallenAngelPlayer => highlightPlayer(fallenAngelPlayer)).join(', ')
    }

    roleName = 'Волк 🐺';
    roleIntroductionText = () => `Новый ${this.roleName} в селе! `;
    startMessageText = () => `Молодец, добился успеха! Убивай каждую ночь селян и добейся победы!`
        + this.showOtherWolfPlayers();

    weight = () => -10;

    nightActionDone = false

    killMessage = () => ({
        text: {
            toChat: (deadPlayer: Player) => `НомномНОМномНОМНОМном... ${highlightPlayer(deadPlayer)} съели заживо!` +
                `\n${highlightPlayer(deadPlayer)} был(а) *${deadPlayer.role?.roleName}*.`,
            toTarget: 'О нет! Ты съеден(а) волком!'
        },
        gif: 'https://media.giphy.com/media/10arlAx4rI0xHO/giphy.gif'
    })

    actionResolve = () => {
        if (!this.targetPlayer) return;

        if (this.targetPlayer.guardianAngel?.role instanceof GuardianAngel) {
            this.handleGuardianAngel(this.player);
            return;
        } else if (this.targetPlayer.role instanceof Beauty && this.targetPlayer.lover !== this.player) {
            this.loveBind(this.targetPlayer);
        } else {
            this.targetPlayer.role?.onKilled(this.player);
        }

        this.targetPlayer = undefined
    }

    handleDeath(killer?: Player, type?: DeathType): boolean {
        const traitorPlayer = Wolf.game.players.find(player => player.role instanceof Traitor && player.isAlive);

        if (this.findOtherWolfPlayers().length <= 0 && traitorPlayer) {
            traitorPlayer.role = new Wolf(traitorPlayer, traitorPlayer.role);
            Wolf.game.bot.sendMessage(
                traitorPlayer.id,
                `Твое время настало, ты обрел новый облик, ${traitorPlayer.role.previousRole?.roleName}! ` +
                `Теперь ты ${traitorPlayer.role.roleName}!`
            )
        }

        if (type === 'wolfCameToSerialKiller') {
            Wolf.game.bot.sendMessage(
                Wolf.game.chatId,
                `*${this.roleName}* ${highlightPlayer(this.player)} ` +
                `попытался хорошо полакомиться этой ночью, но встретил сумасшедшего маньяка!`,
            )
            Wolf.game.bot.sendMessage(
                this.player.id,
                'Ты вышел на охоту, но сам оказался жертвой. '
                + 'Жертвой, которую разрезали на сотню маленьких кусочков.',
            )
            this.player.isAlive = false;
            return true;
        }

        return super.handleDeath(killer, type);
    }
}
