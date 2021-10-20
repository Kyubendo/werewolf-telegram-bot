import TelegramBot from "node-telegram-bot-api";
import {findPlayer} from "./findPlayer";
import {Player} from "../Player/Player";

export const roleChoice = (query: TelegramBot.CallbackQuery, players: Player[]) => {
    const handleChoice = findPlayer(query.from.id, players)?.role?.handleChoice
    handleChoice && handleChoice(findPlayer(query.data, players))
}