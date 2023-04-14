<script>
  export default {
    props: {
      selected: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      rootClasses: function rootClasses () {
        return ['Tab', { 'Tab--Selected': this.selected }]
      }
    }
  }
</script>

<template>
  <button :class="rootClasses">
    <slot></slot>
  </button>
</template>

<style scoped>
  .Tab {
    border: none;
    padding: 5px 10px;
    font-weight: bold;
    border-radius: 4px;
    background-color: transparent;
  }

  .Tab--Selected {
    background-color: #dbe9fe;
  }
</style>
