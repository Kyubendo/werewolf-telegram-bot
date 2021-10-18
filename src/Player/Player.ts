import {RoleBase} from "../Roles/RoleBase";

export class Player {
    constructor(
        readonly id: number, // string?
        readonly name: string,
        readonly username: string,
        readonly role: RoleBase | undefined
    ) {
    }
}
