<script setup lang="ts">
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';

const usersList = [
  {id: 0, label: '4', typeNote: 0, login: '123', password: '123'}
]
</script>

<template>
  <!-- Заголовок таблицы -->
  <div class="mt-4 grid grid-cols-4 gap-4">
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

  <div
  v-for="item in usersList"
  :key="item.id" 
  class="mt-4 grid grid-cols-4 gap-4">
    <div>
      <InputText :model-value="item.label" :maxlength="50" fluid  />
    </div>
    <div>
      {{ item.typeNote }}
    </div>
    <div>
      <!-- {{ item.login }} -->
        <InputText :model-value="item.login" fluid :maxlength="100" />
    </div>
    <div>
      <Password :model-value="item.password" fluid :toggle-mask="true" :feedback="false" />
    </div>
  </div>
</template>