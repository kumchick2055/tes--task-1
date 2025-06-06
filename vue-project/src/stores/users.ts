import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { db, type User } from '@/db'

export enum TypeEntry {
    Local,
    LDAP
}

type UserCreate = Omit<User, 'id'>;

export const useUsersStore = defineStore('defineStore', () => {
    const usersList = ref<Array<User>>([
        // {id: 0, label: ['4', '5'], typeEntry: TypeEntry.LDAP, login: '123', password: '123'}
    ])

    const addUser = async () => {
        
        let data: UserCreate = {
            label: [],
            typeEntry: TypeEntry.Local,
            login: '',
            password: ''
        }

        const id = await db.users.add(data)
        const user: User = {...data, id}

        usersList.value.push(user)
    }

    const updateUser = async (item: User) => {
        // fix DataCloneError
        const cleanItem = JSON.parse(JSON.stringify(item));
        await db.users.put(cleanItem)
    }

    const getUsers = async () => {
        const data = await db.users.toArray()
        usersList.value = data
    }

    const deleteUser = async (id: number) => {
        await db.users.delete(id)

        for(let i = 0; i < usersList.value.length; i++){
            if(usersList.value[i].id === id){
                usersList.value.splice(i, 1)
                break
            }
        }
    }

    
    return {
        usersList,

        getUsers,
        deleteUser,
        addUser,
        updateUser
    }
})