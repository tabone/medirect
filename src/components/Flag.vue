<script>
  export default {
    props: {
      code: {
        type: String,
        required: true
      }
    },

    computed: {
      description: function description () {
        return `Flag of ${this.code}`
      },

      rootClasses: function rootClasses () {
        return this.code == null
          ? null
          : `Flag currency-flag currency-flag-lg currency-flag-${this.code.toLowerCase()}`
      }
    }
  }
</script>

<template>
  <span v-if="code" :class="rootClasses" :aria-label="description"></span>
</template>

<style scoped>
  .Flag {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-position: center;
  }
</style>
