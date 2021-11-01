import {Game} from "../../Game";
import {Player} from "../../Game";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Harlot, SerialKiller, Wolf, GuardianAngel, Gunner, Suicide} from "../index";

export type DeathType = 'loverDeath' | 'lover_betrayal' | 'harlotDeath'; // Harlot


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

    nightActionDone?: boolean

    readonly originalHandleDeath = this.handleDeath;

    readonly onKilled = (killer?: Player, type?: DeathType) => {
        if (!this.player.isAlive) return;
        if (this.handleDeath(killer, type)) {
            /*type !== 'loverDeath' && */
            this.movePlayer();
            this.killLover('loverDeath')
        }
    }

    readonly loveBind = (newLover: Player) => {
        if (this.player.lover === this.player) return;
        this.killLover('lover_betrayal');
        newLover.role?.killLover('lover_betrayal');

        this.player.lover = newLover;
        newLover.lover = this.player;

        this.loverMessage(this.player);
        this.loverMessage(newLover);
    }

    readonly killLover = (type: DeathType) => {
        if (!this.player.lover) return

        if (type !== 'loverDeath')
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
            && guardianAngelPlayer.role instanceof GuardianAngel
            && killer.role?.targetPlayer) { // Дополнительная проверка нужна для доступа к полям GuardianAngel
            RoleBase.game.bot.sendMessage(
                killer.id,
                `Придя домой к ${highlightPlayer(killer.role.targetPlayer)}, ` +
                `у дверей ты встретил ${guardianAngelPlayer.role.roleName}, ` +
                'и тебя вежливо попросили свалить. Ты отказался, потому тебе надавали лещей и ты убежал.'
            )

            RoleBase.game.bot.sendMessage(
                killer.role.targetPlayer.id,
                `${guardianAngelPlayer.role.roleName} наблюдал за тобой этой ночью и защитил тебя от зла!`
            )

            let ending: string = '';
            if (guardianAngelPlayer.role.numberOfAttacks)
                ending = ' Снова!'

            RoleBase.game.bot.sendMessage(
                guardianAngelPlayer.id,
                `С выбором ты угадал, на ` +
                `${highlightPlayer(killer.role.targetPlayer)} действительно напали! Ты спас ему жизнь!`
                + ending
            )

            guardianAngelPlayer.role.numberOfAttacks++;
        }
    }

    doneNightAction = () => {
        this.nightActionDone = true
        if (!RoleBase.game.players.find(p => p.isAlive && p.role?.nightActionDone === false))
            RoleBase.game.setNextStage()
    }

    movePlayer = () => {
        RoleBase.game.players.push(...RoleBase.game.players.splice(
            RoleBase.game.players.indexOf(this.player), 1)); // Delete current player and push it to the end
    }

    handleDeath(killer?: Player, type?: DeathType): boolean {
        console.log(`handleDeath: ${this.player.name} killed by ${killer?.name}, ${type}`);
        if (type === 'loverDeath') {
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
