import {RoleBase} from "../Roles/RoleBase";
import {User} from "node-telegram-bot-api";

export class Player {
    constructor(user: User) {
        this.id = user.id
        this.name = user.first_name
        this.username = user.username

        this.isAlive = true
        this.isFrozen = false
    }

    readonly id: number;
    readonly name: string;
    readonly username?: string;
    readonly isAlive: boolean;
    readonly isFrozen: boolean;
    role?: RoleBase;
}
