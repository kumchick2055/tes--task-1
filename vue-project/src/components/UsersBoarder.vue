<script setup lang="ts">
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Select from 'primevue/select';
import {TypeEntry} from '@/stores/users'
import { ref } from 'vue';
import { useUsersStore } from '@/stores/users';
import type { User } from '@/db';

const typeEntryOptions = ref([
  {name: 'Локальная', val: TypeEntry.Local},
  {name: 'LDAP', val: TypeEntry.LDAP},
])


const usersStore = useUsersStore()
const selectedItem = ref<User|null>(null)

const onFocusItem = async (item: User) => {
  selectedItem.value = item
}

const onBlurItem = async (item: User) => {

}

const onChangeSelect = async (item: User) => {
  if(item.typeEntry === TypeEntry.LDAP){
    item.password = null
  }
  if(item.typeEntry === TypeEntry.Local){
    item.password = ''
  }

  await usersStore.updateUser(item)
}


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
  v-for="item in usersStore.usersList"
  :key="item.id" 
  class="mt-4 grid grid-cols-[1fr_1fr_1fr_1fr_32px] gap-4">
    <div>
      <InputText 
      :onfocus="onFocusItem(item)"
      :onblur="onBlurItem(item)"

      :model-value="item.label.join('; ')" 
      :maxlength="50" 
      fluid/>
    </div>
    <div>
      <Select 
      option-label="name" 
      option-value="val" 
      @change="onChangeSelect(item)"
      v-model="item.typeEntry" 
      :options="typeEntryOptions" 
      fluid 
      />
    </div>
    
    <div v-if="item.typeEntry === TypeEntry.Local">
        <InputText 
        :onfocus="onFocusItem(item)"
        :onblur="onBlurItem(item)"

        :model-value="item.login" 
        :maxlength="100" 
        fluid 
        />
    </div>
    <div v-if="item.typeEntry === TypeEntry.Local">
      <Password
      :onfocus="onFocusItem(item)"
      :onblur="onBlurItem(item)"

      :model-value="item.password" 
      :toggle-mask="true" 
      fluid 
      :feedback="false" />
    </div>
    
    <!-- col-span для объединение ячеек -->
    <div v-if="item.typeEntry === TypeEntry.LDAP" class="col-span-2">
        <InputText 
        :onfocus="onFocusItem(item)"
        :onblur="onBlurItem(item)"

        :model-value="item.login" 
        :maxlength="100" 
        fluid 
        />
    </div>

    <div>
      <Button 
      @click="usersStore.deleteUser(item.id)" 
      icon="pi pi-trash" 
      aria-label="Delete" />
    </div>
  </div>
</template>