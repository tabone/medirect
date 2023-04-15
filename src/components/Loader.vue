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
  <div class="Loader">
    <img
      alt="Loading Spinner"
      src="@/assets/loading.gif" />
    {{message}}
  </div>
</template>

<style scoped>
  .Loader {
    gap: 16px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
</style>
