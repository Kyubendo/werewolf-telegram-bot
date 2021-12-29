import {PrimaryColumn, ManyToOne, Entity} from "typeorm";
import {User} from "./User";

@Entity()
export class UserChat {

    @ManyToOne(() => User, undefined, {primary: true})
    user!: User;

    @PrimaryColumn()
    chatId!: number;
}
