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
        if (killer === undefined) {

        }
        else if (killer.role instanceof Wolf) {
            RoleBase.bot.sendMessage(
                RoleBase.game.chatId,
                `НомномНОМномНОМНОМном... ${this.player.name} съели заживо! 
            ${this.player.name} был(а) ${this.player.role?.roleName}.`
            )
        }

    }

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
