import {Game} from "../../Game/Game";
import {Player} from "../../Player/Player";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Harlot, SerialKiller, Wolf, GuardianAngel} from "../index";

export abstract class RoleBase {
    constructor(readonly player: Player) {
    }

    static game: Game

    abstract readonly roleName: string
    abstract readonly weight: () => number
    abstract readonly startMessageText: () => string

    previousRole?: RoleBase;

    readonly killMessageAll?: (deadPlayer: Player) => string
    readonly killMessageDead?: string
    readonly action?: () => void
    readonly actionResolve?: () => void
    readonly handleChoice?: (choice?: string) => void

    targetPlayer?: Player
    choiceMsgId?: number

    readonly onKilled = (killer: Player) => {
        this.player.isAlive && this.checkGuardianAngel(killer)
        && this.handleDeath(killer) && this.movePlayer() && this.checkHarlotDeath(killer);
    }

    checkGuardianAngel = (killer: Player): boolean => {
        const guardianAngelPlayer = RoleBase.game.players.find(player => player.role instanceof GuardianAngel);
        if (guardianAngelPlayer
            && guardianAngelPlayer.role instanceof GuardianAngel // Дополнительная проверка нужна для доступа к полям GuardianAngel
            && guardianAngelPlayer.role?.targetPlayer === this.player) {

            RoleBase.game.bot.sendMessage(
                killer.id,
                `Придя домой к ${highlightPlayer(this.player)}, ` +
                `у дверей ты встретил ${guardianAngelPlayer.role.roleName}, ` +
                'и тебя вежливо попросили свалить. Ты отказался, потому тебе надавали лещей и ты убежал.'
            )

            RoleBase.game.bot.sendMessage(
                this.player.id,
                `${guardianAngelPlayer.role.roleName}  наблюдал за тобой этой ночью и защитил тебя от зла!`
            )

            let ending: string = '';
            if (guardianAngelPlayer.role.numberOfAttacks)
                ending = ' Снова!'

            RoleBase.game.bot.sendMessage(
                guardianAngelPlayer.id,
                `С выбором ты угадал, на ${highlightPlayer(this.player)} действительно напали! Ты спас ему жизнь!`
                + ending
            )

            guardianAngelPlayer.role.numberOfAttacks++;

            return false;
        }
        return true;
    }

    checkHarlotDeath = (killer: Player) => {
        const harlotPlayer = RoleBase.game.players.find(player => player.role instanceof Harlot);
        if (harlotPlayer && harlotPlayer.role?.targetPlayer === this.player) {
            if (killer.role instanceof Wolf) {
                RoleBase.game.bot.sendMessage(
                    RoleBase.game.chatId,
                    `${highlightPlayer(harlotPlayer)} проскользнула в дом ${highlightPlayer(this.player)}, ` +
                    'готовая чуть повеселиться и снять стресс. Но вместо этого она находит волка, ' +
                    `пожирающего ${highlightPlayer(this.player)}! Волк резко прыгает на ${highlightPlayer(harlotPlayer)}... ` +
                    `${harlotPlayer.role.roleName}  —  ${highlightPlayer(harlotPlayer)} мертва.`,
                )
            } else if (killer.role instanceof SerialKiller) {
                RoleBase.game.bot.sendMessage(
                    RoleBase.game.chatId,
                    `${harlotPlayer.role.roleName}  —  ${highlightPlayer(harlotPlayer)} проникла в дом ` +
                    `${highlightPlayer(this.player)}, но какой-то незнакомец уже потрошит внутренности ` +
                    `${highlightPlayer(this.player)}! Серийный Убийца решил развлечься с ${highlightPlayer(harlotPlayer)}, ` +
                    `прежде чем взять сердце к себе в коллекцию!`,
                )
            }

            harlotPlayer.role.onKilled(harlotPlayer);
        }
    }

    movePlayer = () => {
        RoleBase.game.players.push(...RoleBase.game.players.splice(
            RoleBase.game.players.indexOf(this.player), 1)); // Delete current player and push it to the end
    }

    handleDeath(killer?: Player): boolean {
        killer?.role?.killMessageAll && RoleBase.game.bot.sendMessage(
            RoleBase.game.chatId,
            killer.role.killMessageAll(this.player));

        killer?.role?.killMessageDead && RoleBase.game.bot.sendMessage(
            this.player.id,
            killer.role.killMessageDead);

        this.player.isAlive = false;
        return true;
    }

    choiceMsgEditText = () => {
        RoleBase.game.bot.editMessageText(
            `Выбор принят: ${this.targetPlayer 
                ? highlightPlayer(this.targetPlayer) 
                : 'Пропустить'}.`,
            {
                message_id: this.choiceMsgId,
                chat_id: this.player.id,
            }
        )
    }

    createThisRole = (player: Player): RoleBase => new (this.constructor as any)(player);
}