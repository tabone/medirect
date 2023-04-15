<script>
  import PageLoader from "./PageLoader.vue"

  export default {
    props: {
      title: {
        type: String,
        required: true
      },

      subtitle: {
        type: String
      },

      loading: {
        type: Boolean,
        default: false
      }
    },

    components: {
      PageLoader
    }
  }
  </script>

<template>
  <div class="Page">
    <PageLoader v-if="loading" message="We'll be right with you!" />

    <template v-else>
      <header class="PageHeader">
        <h1 class="PageHeaderTitle">{{title}}</h1>
        <h2 v-if="subtitle" class="PageHeaderSubtitle">{{subtitle}}</h2>
      </header>

      <main>
        <slot></slot>
      </main>
    </template>
  </div>
</template>

<style scoped>
  .Page {
    width: 100%;
    margin: 0 auto;
    max-width: 1000px;
    padding: 16px;
    padding-top: 40px;
  }

  .PageHeader {
    margin-bottom: 40px;
  }

  .PageHeaderTitle {
    padding-bottom: 4px;
    font-size: 3.1em;
  }

  .PageHeaderSubtitle {
    font-size: 1em;
    opacity: .6;
  }
</style>
