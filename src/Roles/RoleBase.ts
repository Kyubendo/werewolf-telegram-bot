import TelegramBot from "node-telegram-bot-api";
import {Game} from "../Game/Game";
import {Player} from "../Player/Player";

export abstract class RoleBase {
    constructor(readonly player: Player) {
    }

    static bot: TelegramBot
    static game: Game
    abstract readonly roleName: string
    abstract readonly weight: number
    abstract readonly startMessageText: string

    readonly handleChoice?: (chosenPlayer?:Player) => void

    readonly nightAction?: () => void
    readonly dayAction?: () => void
    readonly nightActionResolve?: () => void
    readonly dayActionResolve?: () => void
}
