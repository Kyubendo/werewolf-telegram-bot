import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {Win} from "../Game/checkEndGame";
import {Player} from "./Player";

@Entity()
export class Game {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    duration!: number;

    @Column()
    winner!: Win;

    @OneToMany(() => Player, player => player.game)
    players!: Player[];
}
