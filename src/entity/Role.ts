import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
import {RoleBase} from "../Roles";


@Entity()
export class Role extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    static getFromObject(role: RoleBase) {
        return this.findOne({name: role.constructor.name})
    }
}
