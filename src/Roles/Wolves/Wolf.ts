import {generateInlineKeyboard} from "../../Game/playersButtons";
import {Player} from "../../Player/Player";
import {findPlayer} from "../../Game/findPlayer";
import {RoleBase} from "../RoleBase";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Traitor} from "../Villagers/Traitor";

export class Wolf extends RoleBase {
    findWolfPlayers = () => Wolf.game.players.filter(otherPlayer =>
        otherPlayer.role instanceof Wolf
        // && otherPlayer !== this.player
        && otherPlayer.isAlive
    )

    showWolfPlayers(): string {
        const allies = this.findWolfPlayers();
        return `${allies?.length ? ('\nВолки: '
            + allies?.map(ally => highlightPlayer(ally)).join(', ')) : ''}`
    }

    roleName = 'Волк 🐺';
    startMessageText = `Ты ${this.roleName}. Скушай всё село.` + this.showWolfPlayers();
    weight = () => -10;

    killMessageAll = (deadPlayer: Player) => `НомномНОМномНОМНОМном... ${highlightPlayer(deadPlayer)} съели заживо!` +
        `\n${highlightPlayer(deadPlayer)} был(а) ${deadPlayer.role?.roleName}.`
    killMessageDead = 'О нет! Ты съеден(а) волком!'; // GIF

    action = () => {
        if (Wolf.game.stage !== 'night') return;
        Wolf.game.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь съесть?',
            {
                reply_markup: generateInlineKeyboard(
                    Wolf.game.players.filter(player => !(player.role instanceof Wolf) && player.isAlive)
                )
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    actionResolve = () => {
        if (Wolf.game.stage !== 'night' || !this.targetPlayer) return;
        this.targetPlayer.role?.onKilled(this.player);
        this.targetPlayer = undefined
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Wolf.game.players);
        this.choiceMsgEditText();
    }

    handleDeath(killer?: Player): boolean {
        const traitorPlayer = Wolf.game.players.find(player => player.role instanceof Traitor && player.isAlive);
        if (this.findWolfPlayers().length <= 1 && traitorPlayer) {
            const previousRole = traitorPlayer.role;
            traitorPlayer.role = new Wolf(traitorPlayer);
            traitorPlayer.role.previousRole = previousRole;
            Wolf.game.bot.sendMessage(
                traitorPlayer.id,
                `Твое время настало, ты обрел новый облик, ${traitorPlayer.role.previousRole?.roleName}! ` +
                `Теперь ты ${traitorPlayer.role.roleName}!`
            )
        }
        return super.handleDeath(killer);
    }
}
