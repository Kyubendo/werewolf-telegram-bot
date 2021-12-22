import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Game {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    duration!: number;
}
