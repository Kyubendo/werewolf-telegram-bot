import {Game} from "../../Game/Game";
import {Player} from "../../Player/Player";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Harlot, Wolf, GuardianAngel, Prowler} from "../index";

export abstract class RoleBase {
    constructor(readonly player: Player, previousRole?: RoleBase) {
        this.previousRole = previousRole;
    }

    static game: Game

    abstract readonly roleName: string
    abstract readonly weight: () => number
    abstract readonly startMessageText: () => string

    readonly previousRole?: RoleBase;

    readonly killMessageAll?: (deadPlayer: Player) => string
    readonly killMessageDead?: string
    readonly action?: () => void
    readonly actionResolve?: () => void
    readonly handleChoice?: (choice?: string) => void

    targetPlayer?: Player
    choiceMsgId?: number
  
    readonly onKilled = (killer?: Player) => {
        if (!this.player.isAlive) return
        const playerDied = killer ? this.handleLynchDeath() : this.handleDeath(killer)
        playerDied && this.movePlayer()
    }

    checkGuardianAngels = (killer: Player): boolean => {
        const guardianAngelPlayers = RoleBase.game.players.filter(player => player.role instanceof GuardianAngel);

        for (const guardianAngelPlayer of guardianAngelPlayers) {
            if (guardianAngelPlayer
                && guardianAngelPlayer.role instanceof GuardianAngel // Дополнительная проверка нужна для доступа к полям GuardianAngel
                && guardianAngelPlayer.role?.targetPlayer === this.player) {

                RoleBase.game.bot.sendMessage(
                    killer.id,
                    `Придя домой к ${highlightPlayer(this.player)}, ` +
                    `у дверей ты встретил ${guardianAngelPlayer.role.roleName}, ` +
                    'и тебя вежливо попросили свалить. Ты отказался, потому тебе надавали лещей и ты убежал.'
                )

                RoleBase.game.bot.sendMessage(
                    this.player.id,
                    `${guardianAngelPlayer.role.roleName}  наблюдал за тобой этой ночью и защитил тебя от зла!`
                )

                let ending: string = '';
                if (guardianAngelPlayer.role.numberOfAttacks)
                    ending = ' Снова!'

                RoleBase.game.bot.sendMessage(
                    guardianAngelPlayer.id,
                    `С выбором ты угадал, на ${highlightPlayer(this.player)} ` +
                    `действительно напали! Ты спас ему жизнь!` + ending
                )

                guardianAngelPlayer.role.numberOfAttacks++;

                return false;
            }
        }

        return true;
    }

    checkProwlers = (killer: Player) => {
        const prowlerPlayers = RoleBase.game.players.filter(player => player.role instanceof Prowler);

        for (const prowlerPlayer of prowlerPlayers) {
            if (prowlerPlayer?.role
                && prowlerPlayer.role?.targetPlayer === this.player
                && killer.role instanceof Wolf) {
                let text: string;
                if (RoleBase.game.players.filter(player => player.role instanceof Wolf).length === 1)
                    text = `Ты почти добралась до дома ${highlightPlayer(prowlerPlayer.role.targetPlayer)}, ` +
                        'как вдруг услышала ужасные вопли страха изнутри. Ты затаилась недалеко и увидела, ' +
                        `как ${highlightPlayer(killer)}, выходит из дома в обличии волка. ` +
                        'Кажется, ты нашла своего союзника.';
                else
                    text = `Когда ты заглянула в окно к ${highlightPlayer(prowlerPlayer.role.targetPlayer)}, ` +
                        `ты увидела, как стая волков пожирает беднягу. Ужасающее зрелище... ` +
                        `Ужасающее для ${highlightPlayer(prowlerPlayer.role.targetPlayer)}! ` +
                        'А для тебя отличное, ведь ты запомнила лица всех волков! ' + killer.role.showWolfPlayers();

                RoleBase.game.bot.sendMessage(
                    prowlerPlayer.id,
                    text
                )

                prowlerPlayer.role.targetPlayer = prowlerPlayer;
            }
        }
    }

    checkHarlotsDeath = (killer: Player) => {
        const harlotPlayers = RoleBase.game.players.filter(player => player.role instanceof Harlot);

        for (const harlotPlayer of harlotPlayers) {
            if (harlotPlayer && harlotPlayer.role?.targetPlayer === this.player) {
                let text: string;
                if (killer.role instanceof Wolf) {
                    text = `${highlightPlayer(harlotPlayer)} проскользнула в дом ${highlightPlayer(this.player)}, ` +
                        'готовая чуть повеселиться и снять стресс. Но вместо этого она находит волка, ' +
                        `пожирающего ${highlightPlayer(this.player)}! ` +
                        `Волк резко прыгает на ${highlightPlayer(harlotPlayer)}... ` +
                        `*${harlotPlayer.role.roleName}*  —  ${highlightPlayer(harlotPlayer)} мертва.`;
                } else { // else if (killer.role instanceof SerialKiller)
                    text = `*${harlotPlayer.role.roleName}*  —  ${highlightPlayer(harlotPlayer)} проникла в дом ` +
                        `${highlightPlayer(this.player)}, но какой-то незнакомец уже потрошит внутренности ` +
                        `${highlightPlayer(this.player)}! ` +
                        `Серийный Убийца решил развлечься с ${highlightPlayer(harlotPlayer)}, ` +
                        `прежде чем взять сердце к себе в коллекцию!`;
                }

                RoleBase.game.bot.sendMessage(
                    RoleBase.game.chatId,
                    text
                )

                harlotPlayer.role.onKilled(harlotPlayer);
            }
        }
    }

    readonly killPlayerLover = (loverPlayer: Player) => {
        if (loverPlayer.lover) {
            loverPlayer.lover.lover = undefined;
            loverPlayer.lover.role?.onKilled(loverPlayer);
        }
    }


    movePlayer = () => {
        RoleBase.game.players.push(...RoleBase.game.players.splice(RoleBase.game.players.indexOf(this.player), 1)); // Delete current player and push it to the end
    }

    handleDeath(killer?: Player): boolean {
        killer?.role?.killMessageAll && RoleBase.game.bot.sendMessage(
            RoleBase.game.chatId,
            killer.role.killMessageAll(this.player));

        killer?.role?.killMessageDead && RoleBase.game.bot.sendMessage(
            this.player.id,
            killer.role.killMessageDead);

        this.player.isAlive = false;
        return true;
    }

    readonly loverMessage = (newLover: Player) => {
        newLover.lover && RoleBase.game.bot.sendMessage(
            newLover.id,
            `Ты был(а) поражен(а) любовью. ${highlightPlayer(newLover.lover)} навсегда в твоей памяти ` +
            'и любовь никогда не погаснет в твоем сердце... Ваша цель выжить! Если один из вас погибнет, ' +
            'другой умрет из-за печали и тоски.'
        )
      
    handleLynchDeath() {
        RoleBase.game.bot.sendMessage(
            RoleBase.game.chatId,
            `Жители отдали свои голоса в подозрениях и сомнениях... \n`
            + `*${this.player.role?.roleName}* ${highlightPlayer(this.player)} мёртв!`)
        return this.player.role?.handleDeath()
    }

    choiceMsgEditText = () => {
        RoleBase.game.bot.editMessageText(
            `Выбор принят: ${this.targetPlayer
                ? highlightPlayer(this.targetPlayer)
                : 'Пропустить'}.`,
            {
                message_id: this.choiceMsgId,
                chat_id: this.player.id,
            }
        )
    }

    createThisRole = (player: Player, previousRole?: RoleBase): RoleBase =>
        new (this.constructor as any)(player, previousRole);
}
