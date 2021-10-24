import {Game} from "../Game/Game";
import {Player} from "../Player/Player";
import {highlightPlayer} from "../Utils/highlightPlayer";
import {Harlot, SerialKiller, Wolf} from "./index";

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
        this.player.isAlive && this.handleDeath(killer) && this.movePlayer() && this.checkHarlotDeath(killer);
    }

    checkHarlotDeath = (killer: Player) => {
        const harlot = RoleBase.game.players.find(player => player.role instanceof Harlot);
        if (harlot && harlot.role?.targetPlayer === this.player) {
            if (killer.role instanceof Wolf) {
                RoleBase.game.bot.sendMessage(
                    RoleBase.game.chatId,
                    `${highlightPlayer(harlot)} проскользнула в дом ${highlightPlayer(this.player)}, ` +
                    'готовая чуть повеселиться и снять стресс. Но вместо этого она находит волка, ' +
                    `пожирающего ${highlightPlayer(this.player)}! Волк резко прыгает на ${highlightPlayer(harlot)}... ` +
                    `${harlot.role.roleName}  —  ${highlightPlayer(harlot)} мертва.`,
                    {
                        parse_mode: 'Markdown'
                    }
                )
            } else if (killer.role instanceof SerialKiller) {
                RoleBase.game.bot.sendMessage(
                    RoleBase.game.chatId,
                    `${harlot.role.roleName}  —  ${highlightPlayer(harlot)} проникла в дом ` +
                    `${highlightPlayer(this.player)}, но какой-то незнакомец уже потрошит внутренности ` +
                    `${highlightPlayer(this.player)}! Серийный Убийца решил развлечься с ${highlightPlayer(harlot)}, ` +
                    `прежде чем взять сердце к себе в коллекцию!`,
                    {
                        parse_mode: 'Markdown'
                    }
                )
            }

            harlot.role.onKilled(harlot);
        }
    }

    movePlayer = () => {
        RoleBase.game.players.push(...RoleBase.game.players.splice(
            RoleBase.game.players.indexOf(this.player), 1)); // Delete current player and push it to the end
    }

    handleDeath(killer?: Player): boolean {
        killer?.role?.killMessageAll && RoleBase.game.bot.sendMessage(
            RoleBase.game.chatId,
            killer.role.killMessageAll(this.player),
            {
                parse_mode: 'Markdown',
            });
        killer?.role?.killMessageDead && RoleBase.game.bot.sendMessage(
            this.player.id,
            killer.role.killMessageDead
        )
        this.player.isAlive = false;
        return true;
    }

    choiceMsgEditText = () => {
        this.targetPlayer && RoleBase.game.bot.editMessageText(
            `Выбор принят: ${highlightPlayer(this.targetPlayer) || 'Пропустить'}.`,
            {
                message_id: this.choiceMsgId,
                chat_id: this.player.id,
                parse_mode: 'Markdown'
            }
        )
    }

    createThisRole = (player: Player): RoleBase => new (this.constructor as any)(player);
}
