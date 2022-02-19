import {Entity, Column, OneToMany, PrimaryColumn, BaseEntity} from "typeorm";
import {Player} from "./Player";
import * as GameBase from "../Game"

@Entity()
export class User extends BaseEntity {

    @PrimaryColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({nullable: true, type: String})
    username!: string | null;

    @Column()
    rating!: number;

    @OneToMany(() => Player, player => player.user)
    players!: Player[];

    static getFromPlayer(player: GameBase.Player) {
        return this.findOne(player.id)
    }
}
