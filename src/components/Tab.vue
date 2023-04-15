<script>
  export default {
    props: {
      label: {
        type: String,
        required: true
      },

      selected: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      rootClasses: function rootClasses () {
        return ['Tab', { 'Tab--Selected': this.selected }]
      }
    },

    methods: {
      onClick: function onClick () {
        this.$emit('onClick')
      }
    }
  }
</script>

<template>
  <span
    tabindex="0"
    role="checkbox"
    :class="rootClasses"
    :aria-checked="selected"
    @click="onClick">
    {{label}}
  </span>
</template>

<style scoped>
  .Tab {
    border: none;
    cursor: pointer;
    padding: 5px 10px;
    font-weight: bold;
    border-radius: 4px;
    background-color: transparent;
  }

  .Tab--Selected {
    background-color: #dbe9fe;
  }
</style>
