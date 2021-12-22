import {Entity, Column, PrimaryColumn} from "typeorm";

@Entity()
export class Player {

    @PrimaryColumn()
    userId!: number;

    @PrimaryColumn()
    gameId!: number;

    @Column()
    roleId!: number;
}
