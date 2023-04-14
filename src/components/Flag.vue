<script>
  export default {
    props: {
      code: {
        type: String,
        required: true
      }
    },

    computed: {
      rootClasses: function rootClasses () {
        return `Flag currency-flag currency-flag-lg currency-flag-${this.code.toLowerCase()}`
      }
    }
  }
</script>

<template>
  <span :class="rootClasses"></span>
</template>

<style scoped>
  .Flag {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-position: center;
  }
</style>
