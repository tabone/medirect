<script>
  export default {
    props: {
      message: {
        type: String,
        default: "We'll be right with you!"
      }
    }
  }
</script>

<template>
  <div v-if="true" class="PageLoader">
    <img
      alt="Loading Spinner"
      aria-label="Loading..."
      src="@/assets/loading.gif" />

    {{message}}
  </div>
</template>

<style scoped>
  .PageLoader {
    gap: 16px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
</style>
