import {Player} from "../../Game";
import {DeathType} from "../../Game";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Beauty, Cursed, GuardianAngel, RoleBase, Thief, Traitor} from "../index";

export class Wolf extends RoleBase {
    findAllies = () => Wolf.game.players.filter(otherPlayer =>
        otherPlayer.role instanceof Wolf
        && otherPlayer !== this.player
        && otherPlayer.isAlive
    )

    getAlliesMessage = (notify?: boolean): string => {
        const allies = this.findAllies();

        if (notify) {
            let text = '';
            if (this.player.infected)
                text = `Прошло уже 24 часа с тех пор как ${highlightPlayer(this.player)} был заражён укусом. ` +
                    (Math.random() > 0.9
                        ? `Внезапно у ${highlightPlayer(this.player)} отрастают огромные волчьи клыки, ` +
                        `а сам он покрывается шерстью. Теперь он ${this.player.role?.roleName}!`
                        :
                        `С опозданием аж в 5 секунд он всё же превратился в волка. ` +
                        `И как разработчики могли такое допустить...`)
            else if (this.player.role?.previousRole instanceof Cursed)
                text = `С детства над ${highlightPlayer(this.player)} издевалось всё село из-за того, ` +
                    `что он ${this.player.role.previousRole.roleName}. ` +
                    `Теперь он над ними отыграется, потому что он теперь один из вас! Поздравляем нового волка.`
            else if (this.player.role?.previousRole instanceof Thief && this.player.role.targetPlayer)
                text = `Странно, ${highlightPlayer(this.player)} решил стать веганом, ` +
                    `а ${highlightPlayer(this.player.role.targetPlayer)} протяжно выл в ночи и щёлкал зубами! ` +
                    `${highlightPlayer(this.player)} теперь полноценный член стаи.`
            else
                text = `В стае пополнение! ${highlightPlayer(this.player)} больше не выступает в цирке, ` +
                    'теперь он заодно с вами!'

            allies.forEach(ally => {
                Wolf.game.bot.sendMessage(
                    ally.id,
                    text
                )
            })
        }

        if (!allies.length)
            return '\nНо ты один в стае, крепись.'
        return `\n${(allies.length > 1
            ? '\nДругие волки: '
            : '\nТвой брат по волчьему делу — ')
        + allies?.map(ally => highlightPlayer(ally)).join(', ')}`
    }

    roleName = 'Волк 🐺';
    roleIntroductionText = () => `Новый ${this.roleName} в селе!`;
    startMessageText = () => `Молодец, добился успеха! Убивай каждую ночь селян и добейся победы!`
        + this.getAlliesMessage();

    weight = () => -10;

    nightActionDone = false

    killMessage = () => ({
        text: {
            toChat: (deadPlayer: Player) => `НомномНОМномНОМНОМном... ${highlightPlayer(deadPlayer)} съели заживо!` +
                `\n${highlightPlayer(deadPlayer)} был(а) *${deadPlayer.role?.roleName}*.`,
            toTarget: 'О нет! Ты съеден(а) волком!'
        },
        gif: 'https://media.giphy.com/media/10arlAx4rI0xHO/giphy.gif'
    })

    actionResolve = async () => {
        if (!this.targetPlayer) return;

        if (this.targetPlayer.guardianAngel?.role instanceof GuardianAngel) {
            await this.handleGuardianAngel(this.player);
            return;
        } else if (this.targetPlayer.role instanceof Beauty && this.targetPlayer.lover !== this.player) {
            await this.player.loveBind(this.targetPlayer);
        } else {
            await this.targetPlayer.role?.onKilled(this.player);
        }
    }

    async handleDeath(killer?: Player, type?: DeathType): Promise<boolean> {
        const traitorPlayer = Wolf.game.players.find(player => player.role instanceof Traitor && player.isAlive);

        if (this.findAllies().length <= 0 && traitorPlayer) {
            traitorPlayer.role = new Wolf(traitorPlayer, traitorPlayer.role);
            await Wolf.game.bot.sendMessage(
                traitorPlayer.id,
                `Твое время настало, ты обрел новый облик, ${traitorPlayer.role.previousRole?.roleName}! ` +
                `Теперь ты ${traitorPlayer.role.roleName}!`
            )
        }

        return super.handleDeath(killer, type);
    }
}
