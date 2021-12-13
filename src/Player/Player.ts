import {User} from "node-telegram-bot-api";
import {RoleBase, Wolf} from "../Roles";

export class Player {
    constructor(user: User) {
        this.id = user.id
        this.name = user.first_name + (user.last_name ? ' ' + user.last_name : '');
        this.username = user.username

        this.isAlive = true
        this.daysLeftToUnfreeze = 0
    }

    readonly id: number;
    readonly name: string;
    readonly username?: string;
    isAlive: boolean = true;
    daysLeftToUnfreeze: number = 0;
    won: boolean = false;
    role?: RoleBase;
    readyToArson = false;

    lover?: Player;

    infected: boolean = false;

    guardianAngel?: Player;

    readonly transformInfected = () => {
        this.infected = false
        if (this.role instanceof Wolf) return;
        this.role = new Wolf(this, this.role);

        RoleBase.game.bot.sendMessage(
            this.id,
            'С наступлением ночи ты испытал(а) странное покалывание, ноющее чувство, пронзающее все тело, ' +
            'ты стремительно трансформировался(ась)... Теперь ты Волк!\n'
            + (this.role instanceof Wolf && this.role.showOtherWolfPlayers()) // check this line later
        )
    }

    readonly loveBind = async (newLover: Player) => {
        if (!this.role) return;
        await this.role.killLover('lover_betrayal');
        await newLover.role?.killLover('lover_betrayal');

        this.lover = newLover;
        newLover.lover = this;

        await this.role.sendLoverMessage(this);
        await this.role.sendLoverMessage(newLover);
    }
}
