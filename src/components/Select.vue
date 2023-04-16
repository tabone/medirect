<script>
  export default {
    model: {
      prop: 'value',
      event: 'change'
    },

    props: {
      value: {
        type: String
      },

      fullWidth: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      rootClasses: function rootClasses () {
        return ['Select', { 'Select--FullWidth': this.fullWidth }]
      }
    }
  }
</script>

<template>
  <select
    :value="value"
    :class="rootClasses"
    @change="$emit('change', $event.target.value)">
    <slot></slot>
  </select>
</template>

<style scoped>
  .Select {
    padding: 12px 8px;
    border-radius: 6px;
    border: solid 2px #d1d5db;
  }

  .Select--FullWidth {
    width: 100%;
  }
</style>
