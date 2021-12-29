import {Entity, Column, OneToMany, PrimaryColumn} from "typeorm";
import {Player} from "./Player";

@Entity()
export class User {

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
}
