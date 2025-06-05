<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import UsersBoarder from './components/UsersBoarder.vue'
import Button from "primevue/button"
import Message from 'primevue/message';
import { useUsersStore } from './stores/users';
import { onMounted } from 'vue';

const usersStore = useUsersStore()

onMounted(async () => {
  await usersStore.getUsers()
})
</script>

<template>
  <div class="p-4">
    <div class="
    flex 
    items-center 
    gap-4
    font-bold text-2xl">
      <div>
        Учётные записи
      </div>
      <div> 
        <Button @click="usersStore.addUser">+</Button>
      </div>
    </div>
    <div class="mt-2">
      <Message severity="error" icon="pi pi-question" class="mb-2">Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</Message>
    </div>
    <UsersBoarder/>
  </div>
</template>
