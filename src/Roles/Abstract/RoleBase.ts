import {Game} from "../../Game";
import {Player} from "../../Game";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Harlot, SerialKiller, Wolf, GuardianAngel, Gunner, Suicide} from "../index";

export type DeathType = 'lover_death' | 'lover_betrayal'; // Harlot


export abstract class RoleBase {
    constructor(readonly player: Player, previousRole?: RoleBase) {
        this.previousRole = previousRole;
    }

    static game: Game

    abstract readonly roleName: string
    abstract readonly weight: () => number
    readonly roleIntroductionText = () => `Ты ${this.roleName}! `;
    abstract readonly startMessageText: () => string

    readonly previousRole?: RoleBase;

    readonly killMessageAll?: (deadPlayer: Player) => string
    readonly killMessageDead?: string

    readonly actionAnnouncement?: () => {
        message: string,
        gif: string
    }

    readonly action?: () => void
    readonly actionResolve?: () => void
    readonly actionResult?: () => void
    readonly handleChoice?: (choice?: string) => void

    targetPlayer?: Player
    choiceMsgId?: number

    readonly onKilled = (killer?: Player, type?: DeathType) => {
        if (!this.player.isAlive) return
        console.log(`onKilled: ${this.player.name}, ${type}`)
        if (this.handleDeath(killer, type)) {
            /*type !== 'lover_death' && */ this.movePlayer();
            this.killLover('lover_death')
        }
    }

    readonly loveBind = (newLover: Player) => {
        if (this.player.lover === this.player) return;
        console.log(`loveBind: ${this.player.name}, ${newLover.name}`)
        this.killLover('lover_betrayal');
        newLover.role?.killLover('lover_betrayal');

        this.player.lover = newLover;
        newLover.lover = this.player;

        this.loverMessage(this.player);
        this.loverMessage(newLover);
    }

    readonly killLover = (type: DeathType) => {
        if (!this.player.lover) return
        console.log(`killLover: ${this.player.name}, ${type}`)

        if (type !== 'lover_death')
            this.player.lover.lover = undefined;

        this.player.lover.role?.onKilled(this.player, type);
    }

    readonly loverMessage = (newLover: Player) => {
        newLover.lover && RoleBase.game.bot.sendMessage(
            newLover.id,
            `Ты был(а) поражен(а) любовью. ${highlightPlayer(newLover.lover)} навсегда в твоей памяти ` +
            'и любовь никогда не погаснет в твоем сердце... Ваша цель выжить! Если один из вас погибнет, ' +
            'другой умрет из-за печали и тоски.'
        )
    }

    readonly handleGuardianAngel = (killer: Player) => {
        const guardianAngelPlayer = killer.role?.targetPlayer?.guardianAngel;
        if (guardianAngelPlayer
            && guardianAngelPlayer.role instanceof GuardianAngel) { // Дополнительная проверка нужна для доступа к полям GuardianAngel
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
                `С выбором ты угадал, на ${highlightPlayer(this.player)} действительно напали! Ты спас ему жизнь!`
                + ending
            )

            guardianAngelPlayer.role.numberOfAttacks++;
        }
    }

    checkHarlotDeath = (killer: Player) => {
        const harlotPlayer = RoleBase.game.players.find(player => player.role instanceof Harlot);
        if (harlotPlayer && harlotPlayer.role?.targetPlayer === this.player) {
            if (killer.role instanceof Wolf) {
                RoleBase.game.bot.sendMessage(
                    RoleBase.game.chatId,
                    `${highlightPlayer(harlotPlayer)} проскользнула в дом ${highlightPlayer(this.player)}, ` +
                    'готовая чуть повеселиться и снять стресс. Но вместо этого она находит волка, ' +
                    `пожирающего ${highlightPlayer(this.player)}! Волк резко прыгает на ${highlightPlayer(harlotPlayer)}... ` +
                    `${harlotPlayer.role.roleName}  —  ${highlightPlayer(harlotPlayer)} мертва.`,
                )
            } else if (killer.role instanceof SerialKiller) {
                RoleBase.game.bot.sendMessage(
                    RoleBase.game.chatId,
                    `${harlotPlayer.role.roleName}  —  ${highlightPlayer(harlotPlayer)} проникла в дом ` +
                    `${highlightPlayer(this.player)}, но какой-то незнакомец уже потрошит внутренности ` +
                    `${highlightPlayer(this.player)}! Серийный Убийца решил развлечься с ${highlightPlayer(harlotPlayer)}, ` +
                    `прежде чем взять сердце к себе в коллекцию!`,
                )
            }

            harlotPlayer.role.onKilled(harlotPlayer);
        }
    }

    movePlayer = () => {
        RoleBase.game.players.push(...RoleBase.game.players.splice(
            RoleBase.game.players.indexOf(this.player), 1)); // Delete current player and push it to the end
    }

    handleDeath = (killer?: Player, type?: DeathType): boolean => {
        console.log(`handleDeath: ${this.player.name} killed by ${killer?.name}, ${type}`)
        if (type === 'lover_death') {
            killer?.role && RoleBase.game.bot.sendMessage(
                RoleBase.game.chatId,
                `Бросив взгляд на мертвое тело ${highlightPlayer(killer)}, ` +
                `${highlightPlayer(this.player)} падает на колени и рыдает. ` +
                `${highlightPlayer(this.player)}, не выдерживая боли, хватает ближайший пистолет и ` +
                (this.player.role instanceof Suicide
                    ? 'перед тем, как нажать на курок, его сердце останавливается от горя! ' +
                    'Он не успевает покончить с собой!'
                    : 'выстреливает в себя...') +
                `\n${highlightPlayer(this.player)} был(а) *${this.roleName}*.`
            )

            // new message for players if their lover died
        } else if (type === 'lover_betrayal') {
            RoleBase.game.bot.sendMessage(
                RoleBase.game.chatId,
                'Жители деревни просыпаются на следующее утро и обнаруживают, ' +
                `что ${highlightPlayer(this.player)} покончил(а) с собой прошлой ночью. ` +
                'Возле остывающего тела лежит недописанное любовное письмо.'
            )

            killer && RoleBase.game.bot.sendMessage(
                killer.id,
                'Поскольку ты влюбляешься в другого(ую), ' +
                `${highlightPlayer(this.player)} должен(на) покинуть тебя. ` +
                'Ты расстаешься с ним(ней), больше не заботясь о его(ее) благополучии.'
            )
        } else if (killer?.role) {
            if (killer.role instanceof Gunner)
                killer.role.actionAnnouncement && RoleBase.game.bot.sendAnimation(
                    RoleBase.game.chatId,
                    killer.role.actionAnnouncement().gif, {caption: killer.role.actionAnnouncement().message}
                )
            killer?.role?.killMessageAll && RoleBase.game.bot.sendMessage(
                RoleBase.game.chatId,
                killer.role.killMessageAll(this.player)
            );

            killer?.role?.killMessageDead && RoleBase.game.bot.sendMessage(
                this.player.id,
                killer.role.killMessageDead
            );
        } else if (!killer) {
            RoleBase.game.bot.sendMessage(
                RoleBase.game.chatId,
                `Жители отдали свои голоса в подозрениях и сомнениях... \n`
                + `*${this.player.role?.roleName}* ${highlightPlayer(this.player)} мёртв!`
            )
        }
        this.player.isAlive = false;
        return true;
    }
    readonly originalHandleDeath = this.handleDeath

    choiceMsgEditText = () => {
        RoleBase.game.bot.editMessageText(
            `Выбор принят — ${this.targetPlayer
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
