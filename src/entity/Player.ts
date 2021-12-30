import {Entity, Column, ManyToOne, BaseEntity} from "typeorm";
import {User} from "./User";
import {Game} from "./Game";
import {Role} from "./Role";

@Entity()
export class Player extends BaseEntity{

    @ManyToOne(() => User, user => user.players, {primary: true})
    user!: User;

    @ManyToOne(() => Game, game => game.players, {primary: true})
    game!: Game;

    @ManyToOne(() => Role)
    initialRole!: Role;

    @ManyToOne(() => Role)
    finalRole!: Role;

    @ManyToOne(() => User, {nullable: true})
    loverUser!: User | null;

    @Column()
    won!: boolean;
}
