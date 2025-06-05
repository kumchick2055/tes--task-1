<script setup lang="ts">
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Select from 'primevue/select';
import {TypeEntry} from '@/stores/users'
import { ref } from 'vue';
import { useUsersStore } from '@/stores/users';
import type { User } from '@/db';
import { reactive } from 'vue';
import { ErrorCodes } from 'vue';

const typeEntryOptions = ref([
  {name: 'Локальная', val: TypeEntry.Local},
  {name: 'LDAP', val: TypeEntry.LDAP},
])


const usersStore = useUsersStore()
const selectedItem = ref<User|null>(null)
// Хранение значений меток, для последующей записи
const labelsErrors = reactive<Record<number,Record<string,any>>>({});


const onFocusItem = async (item: User) => {
  selectedItem.value = item
}

const onBlurItem = async (item: User) => {
  const errors = []

  // Если есть ошибка в метках, пропускаем
  if(labelsErrors[item.id]?.error){
    errors.push('labels')
  }

  if(errors.length > 0){
    console.log(errors)
  } else {

    if(labelsErrors[item.id]?.texts){
      item.label = labelsErrors[item.id]?.texts
    }

    await usersStore.updateUser(item)
    selectedItem.value = null;
  }


}

const onChangeText = async (event: any, item: User) => {
  const texts: string[] = event.split(';')

  for(let i of texts){
    if(i.length >= 50){
      labelsErrors[item.id] = {error: true}
      break;
    } else {
      labelsErrors[item.id] = {error: false}
    }
  }

  // Если ошибок нету, ставим список
  if(labelsErrors[item.id]?.error === false){
    const a = []
    for(let i of texts){
      a.push({text: i.trim()})
    }
    labelsErrors[item.id].texts = a;
  }


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
      <!-- :onblur="onBlurItem(item)" -->
       
      <InputText 
      v-on:focus="onFocusItem(item)"
      v-on:blur="onBlurItem(item)"

      v-on:value-change="onChangeText($event, item)"
      :model-value="item.label.map(n => n.text).join('; ')" 
      :invalid="labelsErrors[item.id]?.error === true"
      fluid/>

      <Message
      v-if="labelsErrors[item.id]?.error === true"  
      severity="error" 
      size="small" 
      variant="simple">Длина метки больше 50 символов!</Message>
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
        v-on:blur="onBlurItem(item)"
        :invalid="item.login.length === 0"
        v-model="item.login" 
        :maxlength="100" 
        fluid 
        />
        <Message
        v-if="item.login.length === 0"
        severity="error" 
        size="small" 
        variant="simple">Логин не может быть пустым символов!</Message>
    </div>
    <div v-if="item.typeEntry === TypeEntry.Local">
      <Password
      :onfocus="onFocusItem(item)"
      v-on:blur="onBlurItem(item)"
      :invalid="item.password?.length === 0"

      v-model="item.password" 
      :toggle-mask="true" 
      fluid 
      :feedback="false" />
      <Message
        v-if="item.password?.length === 0"
        severity="error" 
        size="small" 
        variant="simple">Пароль не может быть пустым символов!</Message>
    </div>
    
    <!-- col-span для объединение ячеек -->
    <div v-if="item.typeEntry === TypeEntry.LDAP" class="col-span-2">
        <InputText 
        :onfocus="onFocusItem(item)"
        v-on:blur="onBlurItem(item)"

        v-model="item.login" 
        :maxlength="100" 
        fluid 
        />
        <Message
        v-if="item.login.length === 0"
        severity="error" 
        size="small" 
        variant="simple">Логин не может быть пустым символов!</Message>
    </div>

    <div>
      <Button 
      @click="usersStore.deleteUser(item.id)" 
      icon="pi pi-trash" 
      aria-label="Delete" />
    </div>
  </div>
</template>