import {RoleBase} from "../Roles/Abstract/RoleBase";
import {User} from "node-telegram-bot-api";
import {Wolf} from "../Roles";

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

    infected: boolean = false;

    readonly transformInfected = () => {
        this.role = new Wolf(this, this.role);

        RoleBase.game.bot.sendMessage(
            this.id,
            'С наступлением ночи ты испытал(а) странное покалывание, ноющее чувство, пронзающее все тело, ' +
            'ты стремительно трансформировался(ась)... Теперь ты Волк!\n'
            + (this.role instanceof Wolf && this.role.showWolfPlayers()) // check this line later
        )
    }
}
