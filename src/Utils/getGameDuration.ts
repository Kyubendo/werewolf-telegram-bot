import {RoleBase} from "../Roles";
import {msToMinutes} from "./msToMinutes";

export const getGameDuration = () => {
    if (RoleBase.game.gameStartedTime)
        return msToMinutes((new Date).getTime() - RoleBase.game.gameStartedTime)
}