<script>

import TodoItem from  './components/TodoItem.vue';

let data = {
  todos: [{ text: 'Faire les courses', checked: true }, { text: 'Apprendre REST', checked: false}],
  title: "Mes taches",
  newItem: ''
};

export default {
  data() {
    return data;
  },
  methods: {
    addItem: function() {
      let text = this.newItem.trim();
      if (text) {
        this.todos.push({ text: text, checked: false });
        this.newItem = '';
      }
    }
  },
  components: { TodoItem }
};
</script>

<template>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" integrity ="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin ="anonymous">
  <div class="container">
    <div class="input-group">
      <input type="text" class="form-control" v-model="newItem" @keyup.enter="addItem" placeholder="Ajouter une tache à la liste">
      <span class="input-group-btn">
        <button class="btn btn-default" @click="addItem" type="button">Ajouter</button>
      </span>
    </div>
    <h2>{{ title }}</h2>
    <ol>
      <TodoItem v-for="item of todos" :todo="item" :key="item.id" @remove="removeItem"></TodoItem>
    </ol>
  </div>
</template>