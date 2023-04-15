<script>
  import Chart from 'chart.js/auto'

  export default {
    props: {
      data: {
        type: Object,
        required: true
      },

      options: {
        type: Object,
        required: true
      }
    },

    data: () => {
      return {
        chart: null
      }
    },

    mounted: function mounted () {
      this.chart = new Chart(
        this.$el,
        {
          type: 'line',
          data: this.data,
          options: this.options
        }
      )
    }
  }
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
