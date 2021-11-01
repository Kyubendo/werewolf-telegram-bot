import {Player} from "../Player/Player";

export const findPlayer = (userId: number | string | undefined, players: Player[]): Player | undefined =>
    userId === undefined ? undefined : players.find(player => player.id === +userId)
