import TelegramBot from "node-telegram-bot-api";
import {Game} from "../Game/Game";
import {Player} from "../Player/Player";
import {Wolf} from "./Wolfs/Wolf";

export abstract class RoleBase {
    constructor(readonly player: Player) {
    }

    static bot: TelegramBot
    static game: Game
    abstract readonly roleName: string
    abstract readonly weight: number
    abstract readonly startMessageText: string

    readonly handleChoice?: (choice?: string) => void

    handleDeath = (killer?: Player) => {
        this.player.isAlive = false;
        return true;
    }

    abstract readonly killMessage: string;

    targetPlayer?: Player
    choiceMsgId?: number

    choiceMsgEditText = () => {
        RoleBase.bot.editMessageText(
            `Выбор принят: ${this.targetPlayer?.name}.`,
            {message_id: this.choiceMsgId, chat_id: this.player.id}
        )
    }

    readonly action?: () => void
    readonly actionResolve?: () => void
}
