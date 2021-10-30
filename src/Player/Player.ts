import {RoleBase} from "../Roles/Abstract/RoleBase";
import {User} from "node-telegram-bot-api";
import {FallenAngel, GuardianAngel, Wolf} from "../Roles";
import {highlightPlayer} from "../Utils/highlightPlayer";

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
    won: boolean = false;
    role?: RoleBase;

    infected: boolean = false;

    readonly transformInfected = () => {
        let text: string;
        if (this.role instanceof GuardianAngel) {
            this.role = new FallenAngel(this, this.role);
            FallenAngel.game.bot.sendMessage(
                this.id,
                this.role.startMessageText()
            )
            const allies = GuardianAngel.game.players.filter(otherPlayer =>
                otherPlayer.role instanceof Wolf
                && otherPlayer.isAlive
            )
            const wolfText = '\n' + (allies.length > 1
                ? 'Волки'
                : allies.length === 1
                    ? 'Волк'
                    : 'Однако волков уже нет в живых...' + allies.map(ally => highlightPlayer(ally)).join(', '));

            text = 'Боль пробегает по твоему телу, когда твои белые крылья становятся черными. ' +
                'Сквозь боль трансформации ты борешься с собой и с тем злом, которое пытается тобой овладеть... ' +
                'Несколько часов - и все кончено. Ты встаешь, чтобы посмотреть на себя: ' +
                'ничего не осталось от твоей прежней божественной красоты. ' +
                'Ты стал Падшим Ангелом, союзником волков.' + wolfText;
        } else {
            this.role = new Wolf(this, this.role);
            text = 'С наступлением ночи ты испытал(а) странное покалывание, ноющее чувство, пронзающее все тело, ' +
                'ты стремительно трансформировался(ась)... Теперь ты Волк!\n'
                + (this.role instanceof Wolf && this.role.showOtherWolfPlayers())
        }
        RoleBase.game.bot.sendMessage(
            this.id,
            text
        )
    }
}
