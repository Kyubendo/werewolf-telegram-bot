import {GameMode, GameModeList} from "../Game/Game";

export const validGameMode = (mode?: string): mode is GameMode => GameModeList.includes(mode as GameMode)
