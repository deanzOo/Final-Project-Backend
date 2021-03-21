export interface ISafeUser {
    id: number,
    phone: string,
    firstname?: string,
    lastname?: string,
    email?: string,
    session_key?: string,
    isAdmin?: true
}

export interface ISafeAuthData {
    user?: ISafeUser;
    session_key?: string
}

export interface ISafeUsersData {
    admins?: ISafeUser[],
    users?: ISafeUser[],
    admin?: ISafeUser,
    user?: ISafeUser
}