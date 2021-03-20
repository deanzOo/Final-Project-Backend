export interface ISafeUser {
    id: number,
    phone: string,
    firstname?: string,
    lastname?: string,
    email?: string,
    session_key?: string
}

export interface ISafeData {
    user?: ISafeUser;
}