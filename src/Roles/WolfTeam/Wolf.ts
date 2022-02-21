import {DeathType, Player} from "../../Game";
import {playerLink} from "../../Utils/playerLink";
import {Beauty, Cursed, GuardianAngel, RoleBase, Thief, Traitor, WildChild} from "../index";

export class Wolf extends RoleBase {
    findAllies = () => Wolf.game.players.filter(otherPlayer =>
        otherPlayer.role instanceof Wolf
        && otherPlayer !== this.player
        && otherPlayer.isAlive
    )

    sendAlliesMessage = async (notify: boolean = false): Promise<void> => {
        const allies = this.findAllies();

        if (notify) {
            let notificationText;
            if (this.player.infected)
                notificationText = `Прошло уже 24 часа с тех пор как ${playerLink(this.player)} ` +
                    `был заражён укусом. ` + (Math.random() < 0.9
                        ? `Внезапно у ${playerLink(this.player)} отрастают огромные волчьи клыки, ` +
                        `а сам он покрывается шерстью. Теперь он ${this.player.role?.roleName}!`
                        : `С опозданием аж в 5 секунд он всё же превратился в волка. ` +
                        `И как разработчики могли такое допустить...`)
            else if (this.player.role?.previousRole instanceof Cursed)
                notificationText = (Math.random() < 0.9
                    ? `До этого над ${playerLink(this.player)} издевалось всё село из-за того, ` +
                    `что он ${this.player.role.previousRole.roleName}. ` +
                    `Теперь он над ними по полной отыграется, ведь он теперь один из вас! Поздравляем нового волка.`
                    : `С детства над ${playerLink(this.player)} издевалась вся деревня из-за того, ` +
                    `что в нём запечатан Девятихвостый ${this.player.role.roleName}. ` +
                    `Как только его укусили, хвостатый сразу же вырвался на свободу! ` +
                    `Но вы ему объяснили, что у вас все равны и отрезали ему 8 хвостов. ` +
                    `Теперь он просто ${this.player.role.roleName}`)
            else if (this.player.role?.previousRole instanceof Thief && this.player.role.targetPlayer)
                notificationText = `Странно, ${playerLink(this.player)} решил стать веганом, ` +
                    `а ${playerLink(this.player.role.targetPlayer)} протяжно выл в ночи и щёлкал зубами! ` +
                    `${playerLink(this.player)} теперь полноценный член стаи.`
                else if (this.player.role?.previousRole instanceof WildChild)
                    notificationText = `Пример игрока ${playerLink(this.player)} умер! Теперь, он стал волком!`
            else
                notificationText = `В стае пополнение! ${playerLink(this.player)} больше не выступает в цирке, ` +
                    'теперь он заодно с вами!'

            for (const ally of allies) {
                await Wolf.game.bot.sendMessage(
                    ally.id,
                    notificationText
                )
            }
        }

        let alliesInfoText: string = '\n'

        if (!allies.length)
            alliesInfoText += 'Ты один в стае, крепись.'
        else {
            if (allies.length === 1)
                alliesInfoText += 'Твой брат по волчьему делу — '
            else
                alliesInfoText += 'Другие волки: '

            alliesInfoText += allies?.map(ally => playerLink(ally)).join(', ')
        }

        await Wolf.game.bot.sendMessage(
            this.player.id,
            alliesInfoText
        )
    }

    roleName = 'Волк 🐺';
    roleIntroductionText = () => `Новый ${this.roleName} в селе!`;
    startMessageText = () => `Молодец, добился успеха! Убивай каждую ночь селян и добейся победы!`

    nightActionDone = false

    killMessage = () => ({
        text: {
            toChat: (deadPlayer: Player) => `НомномНОМномНОМНОМном... ${playerLink(deadPlayer)} съели заживо!` +
                `\n${playerLink(deadPlayer)} был(а) *${deadPlayer.role?.roleName}*.`,
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
