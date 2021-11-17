import {User} from "node-telegram-bot-api";
import {RoleBase, FallenAngel, GuardianAngel, Wolf} from "../Roles";
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
    isAlive: boolean = true;
    isFrozen: boolean = false;
    won: boolean = false;
    role?: RoleBase;

    lover?: Player;

    infected: boolean = false;

    guardianAngel?: Player;

    readonly transformInfected = () => {
        let text: string;
        if (this.role instanceof GuardianAngel) {
            const wolfPlayers = GuardianAngel.game.players.filter(player =>
                player.role instanceof Wolf
                && player.isAlive)

            const otherFallenAngelPlayers = GuardianAngel.game.players.filter(player =>
                player.role instanceof FallenAngel
                && player.isAlive)

            this.role = new FallenAngel(this, this.role);

            const wolfText = (wolfPlayers.length > 1
                    ? '\nВолки: '
                    : wolfPlayers.length === 1
                        ? '\nВолк: '
                        : '\nОднако волков уже нет в живых...')
                + wolfPlayers
                    .map(ally => highlightPlayer(ally)).join(', ')
                + (!otherFallenAngelPlayers.length
                    ? ''
                    : otherFallenAngelPlayers.length > 1
                        ? '\nТвои чернокрылые братья и сёстры: '
                        : '\nТвой чернокрылый брат — ')
                + otherFallenAngelPlayers
                    .map(otherFallenAngelPlayer => highlightPlayer(otherFallenAngelPlayer)).join(', ')

            text = this.role.startMessageText() + wolfText;
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
        this.infected = false
    }

    readonly loveBind = (newLover: Player) => {
        if (!this.role) return;
        this.role.killLover('lover_betrayal');
        newLover.role?.killLover('lover_betrayal');

        this.lover = newLover;
        newLover.lover = this;

        this.role.loverMessage(this);
        this.role.loverMessage(newLover);
    }
}
