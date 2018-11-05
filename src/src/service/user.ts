export interface User {
    username: string
    password: string
}
interface Users {
    [username: string]: User
}

let users: Users = {}

export function logIn(username: string, password: string): boolean {
    return !!users[username] && users[username].password === password
}

export function setupUsers(newUsers: Users) {
    users = newUsers
}
