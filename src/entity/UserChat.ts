import {PrimaryColumn, ManyToOne, Entity, BaseEntity} from "typeorm";
import {User} from "./User";

@Entity()
export class UserChat extends BaseEntity{

    @ManyToOne(() => User, undefined, {primary: true})
    user!: User;

    @PrimaryColumn()
    chatId!: number;
}
