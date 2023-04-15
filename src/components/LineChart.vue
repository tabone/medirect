<script>
  import Chart from 'chart.js/auto'

  export default {
    props: {
      name: {
        type: String,
        required: true
      },

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

    computed: {
      records: function records () {
        return this.data.labels.map(
          (label, index) => {
            return {
              label,
              data: this.data.datasets[0].data[index]
            }
          }, []
        )
      }
    },

    mounted: function mounted () {
      this.chart = new Chart(
        this.$refs.canvas,
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
  <div class="LineChart">
    <table :aria-label="name" class="LineChartTable">
      <thead>
        <tr>
          <th>
            Dates
          </th>
          <th>
            {{ name }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="record in records">
          <td>{{record.label}}</td>
          <td>{{record.data}}</td>
        </tr>
      </tbody>
    </table>

    <canvas ref="canvas" class="LineChartChart"></canvas>
  </div>
</template>

<style scoped>
  .LineChart {
    height: 100%;
  }

  .LineChartChart {
    height: 100%;
  }

  .LineChartTable:not(:focus):not(:active) {
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      height: 1px;
      overflow: hidden;
      position: absolute;
      white-space: nowrap;
      width: 1px;
  }
</style>
