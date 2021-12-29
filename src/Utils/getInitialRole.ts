import {RoleBase} from "../Roles";

export const getInitialRole = (role: RoleBase): RoleBase => role.previousRole ? getInitialRole(role.previousRole) : role