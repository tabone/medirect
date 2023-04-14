<script>
  export default {
    props: {
      title: {
        type: String,
        required: true
      },

      subtitle: {
        type: String
      }
    }
  }
  </script>

<template>
  <div class="Page">
    <header class="PageHeader">
      <h1 class="PageHeaderTitle">{{title}}</h1>
      <h2 class="PageHeaderSubtitle">{{subtitle}}</h2>
    </header>

    <main>
      <slot></slot>
    </main>
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
