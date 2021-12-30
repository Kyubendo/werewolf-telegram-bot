import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
import {RoleBase} from "../Roles";


@Entity()
export class Role extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    static async getFromObject(roleObj: RoleBase) {
        let role = await this.findOne({name: roleObj.constructor.name})
        if (!role) this.create({name: roleObj.constructor.name})
        return role
    }
}
