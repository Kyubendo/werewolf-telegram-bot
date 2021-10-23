import TelegramBot from "node-telegram-bot-api";
import {Game} from "../Game/Game";
import {Player} from "../Player/Player";
import {highlightPlayer} from "../Utils/highlightPlayer";

export abstract class RoleBase {
    constructor(readonly player: Player) {
    }

    static game: Game

    abstract readonly roleName: string
    abstract readonly weight: () => number
    abstract readonly startMessageText: string

    previousRole?: RoleBase;

    readonly killMessage?: (deadPlayer: Player) => string
    readonly action?: () => void
    readonly actionResolve?: () => void
    readonly handleChoice?: (choice?: string) => void

    targetPlayer?: Player
    choiceMsgId?: number

    handleDeath(killer?: Player) {
        killer?.role?.killMessage && RoleBase.game.bot.sendMessage(
            RoleBase.game.chatId,
            killer.role.killMessage(this.player),
            {
                parse_mode: 'Markdown',
            });
        this.player.isAlive = false;
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
}
