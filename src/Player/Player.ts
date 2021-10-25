import {RoleBase} from "../Roles/Abstract/RoleBase";
import {User} from "node-telegram-bot-api";

export class Player {
    constructor(user: User) {
        this.id = user.id
        this.name = user.first_name + (user.last_name ? ' ' + user.last_name : '');
        this.username = user.username

        this.isAlive = true
        this.isFrozen = false
    }

    readonly id: number;
    readonly name: string;
    readonly username?: string;
    isAlive: boolean;
    isFrozen: boolean;
    role?: RoleBase;
}
