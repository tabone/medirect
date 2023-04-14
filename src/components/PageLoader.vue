<script>
  import Loader from "./Loader.vue"

  export default {
    props: {
      message: {
        type: String,
        default: "We'll be right with you!"
      }
    },

    components: {
      Loader
    }
  }
</script>

<template>
  <div class="PageLoader">
    <Loader :message="message" />
  </div>
</template>

<style scoped>
  .PageLoader {
    position: fixed;
    gap: 16px;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
</style>
