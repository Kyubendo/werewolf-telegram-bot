import {Game} from "../Game/Game";
import TelegramBot from "node-telegram-bot-api";
import {State} from "../Bot";

export abstract class RoleBase {
    constructor(readonly bot: TelegramBot, readonly state: State) { //change to Game
    }

    abstract readonly roleName: string;
    abstract readonly weight: number;
    abstract readonly startMessageText: string;
    readonly nightAction?: () => void
    readonly dayAction?: () => void

}
