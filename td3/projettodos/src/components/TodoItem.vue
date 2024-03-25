<script>

export default {
  props: {
    todo: Object
  },
  methods: {
    suppr : function() {
      this.$emit('remove',{id: this.todo.id});
    }
  },
  emits: ['remove']
};
</script>

<template>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" integrity ="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin ="anonymous">
  <li v-bind:class="{ 'alert alert-success': todo.done }">
    <div class="checkbox">
      <label><input type="checkbox" v-model="todo.done"> <span v-if="!todo.modifier">{{ todo.title }}</span><input type="text" v-model="todo.title" v-if="todo.modifier"/></label>
      <input type="button" class="btn btn-warning" value="Modifier" @click="todo.modifier=!todo.modifier" v-if="!todo.modifier">
      <input type="button" class="btn btn-success" value="Sauvegarder" @click="todo.modifier=!todo.modifier" v-if="todo.modifier">
      <input type="button" class="btn btn-danger" value="Supprimer" @click="suppr">
    </div>
    <div><span v-if="!todo.modifier">{{ todo.description }}</span><input type="text" v-model="todo.description" v-if="todo.modifier"/></div>
  </li>
</template>