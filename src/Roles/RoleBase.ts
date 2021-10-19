import TelegramBot from "node-telegram-bot-api";
import {Game} from "../Game/Game";

export abstract class RoleBase {
    constructor(readonly bot: TelegramBot, readonly game: Game) { //change to Game
    }

    abstract readonly roleName: string;
    abstract readonly weight: number;
    abstract readonly startMessageText: string;
    readonly nightAction?: () => void
    readonly dayAction?: () => void
    readonly nightActionResolve?: () => void
    readonly dayActionResolve?: () => void
}
