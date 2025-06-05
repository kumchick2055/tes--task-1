import Dexie, {type EntityTable} from "dexie";
import type { TypeEntry } from "./stores/users";

interface User {
    id: number,
    label: Record<string, string>[],
    typeEntry: TypeEntry,
    login: string,
    password: string | null
}

const db = new Dexie('UsersDatabase') as Dexie & {
    users: EntityTable<
        User,
        'id'
    >
}

db.version(1).stores({
    users: '++id, label, typeEntry, login, password'
})

export type {User}
export {db}