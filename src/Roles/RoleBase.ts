import TelegramBot from "node-telegram-bot-api";
import {Game} from "../Game/Game";
import {Player} from "../Player/Player";

export abstract class RoleBase {
    constructor(readonly player: Player) {
    }

    static bot: TelegramBot
    static game: Game

    abstract readonly roleName: string
    abstract readonly weight: () => number
    abstract readonly startMessageText: string

    previousRole?: RoleBase;

    readonly killMessage?: (deadPlayer: Player) => void
    readonly action?: () => void
    readonly actionResolve?: () => void
    readonly handleChoice?: (choice?: string) => void

    targetPlayer?: Player
    choiceMsgId?: number

    handleDeath = (killer?: Player) => {
        killer?.role?.killMessage && killer.role.killMessage(this.player);
        this.player.isAlive = false;
    }

    choiceMsgEditText = () => {
        RoleBase.bot.editMessageText(
            `Выбор принят: ${this.targetPlayer?.name || 'Пропустить'}.`,
            {message_id: this.choiceMsgId, chat_id: this.player.id}
        )
    }
}
