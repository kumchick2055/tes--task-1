<script setup lang="ts">
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Select from 'primevue/select';
import {TypeEntry} from '@/stores/users'
import { ref } from 'vue';

const typeEntryOptions = ref([
  {name: 'Локальная', val: TypeEntry.Local},
  {name: 'LDAP', val: TypeEntry.LDAP},
])

const usersList = [
  {id: 0, label: '4', typeEntry: TypeEntry.LDAP, login: '123', password: '123'}
]
</script>

<template>
  <!-- Заголовок таблицы -->
  <div class="mt-4 grid grid-cols-[1fr_1fr_1fr_1fr_32px] gap-4">
    <div>
      Метки
    </div>
    <div>
      Тип записи
    </div>
    <div>
      Логин
    </div>
    <div>
      Пароль
    </div>
    
  </div>

  <!-- Список юзеров -->
  <div
  v-for="item in usersList"
  :key="item.id" 
  class="mt-4 grid grid-cols-[1fr_1fr_1fr_1fr_32px] gap-4">
    <div>
      <InputText :model-value="item.label" :maxlength="50" fluid  />
    </div>
    <div>
      <Select fluid option-label="name" option-value="val" :model-value="item.typeEntry" :options="typeEntryOptions" />
    </div>
    <div v-if="item.typeEntry === TypeEntry.Local">
      <div>
          <InputText :model-value="item.login" fluid :maxlength="100" />
      </div>
      <div>
        <Password :model-value="item.password" fluid :toggle-mask="true" :feedback="false" />
      </div>
    </div>
    <div v-else-if="item.typeEntry === TypeEntry.LDAP" class="col-span-2">
        <InputText :model-value="item.login" fluid :maxlength="100" />
    </div>
    <div>
      <Button icon="pi pi-trash" aria-label="Delete" />
    </div>
  </div>
</template>