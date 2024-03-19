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
  <li v-bind:class="{ 'alert alert-success': todo.checked }">
    <div class="checkbox">
      <label><input type="checkbox" v-model="todo.checked"> {{ todo.text }}</label>
      <input type="button" class="btn btn-warning" value="Modifier" @click="modif">
      <input type="button" class="btn btn-danger" value="Supprimer" @click="suppr">
    </div>
  </li>
</template>