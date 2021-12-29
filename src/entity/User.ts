import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {Player} from "./Player";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    username!: string;

    @Column()
    rating!: number;

    @OneToMany(() => Player, player => player.user)
    players!: Player[];
}
