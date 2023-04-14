<script>
  import 'chart.js/auto'
  import { Line as LineChart } from "vue-chartjs";

  import Tab from "./Tab.vue"
  import Flag from "./Flag.vue"
  import Loader from "./Loader.vue"

  import axios from "../axios"

  export default {
    props: {
      codeFrom: {
        type: String,
        required: true
      },

      codeTo: {
        type: String,
        required: true
      }
    },

    data: () => {
      return {
        data: [],
        loading: false,
        frequency: '1D'
      }
    },

    mounted: function mounted () {
      this.refreshData()
    },

    components: {
      Tab,
      Flag,
      Loader,
      LineChart
    },

    watch: {
      frequency: function frequency () {
        this.refreshData()
      },

      currencyPair: function currencyPair () {
        this.refreshData()
      }
    },

    computed: {
      currencyPair: function currencyPair () {
        return `${this.codeFrom}${this.codeTo}`
      },

      frequencies: function frequencies () {
        return ['15M', '1H', '1D', '1W', '1M']
      },

      chartData: function chartData () {
        const {
          data,
          labels
        } = this.data.reduce(
          (info, record) => {
            info.data.push(record.data)
            info.labels.push(record.label)

            return info
          }, {
            data: [],
            labels: []
          }
        )

        return {
          labels,
          datasets: [
            {
              data,
              fill: 'origin',
              pointRadius: 0,
              label: 'Data One',
              borderColor: '#7bc414',
              backgroundColor: '#f2f9ea'
            }
          ]
        }
      },

      chartOptions: function chartOptions () {
        return {
          responsive: true,
          maintainAspectRatio: false,

          plugins: {
            legend: {
              display: false
            }
          },

          scales: {
            x: { display: false },
            y: { display: false }
          }
        }
      }
    },

    methods: {
      get1DData() {
        const toDate = new window.Date()
        toDate.setDate(toDate.getDate() - 1)

        const fromDate = new window.Date()
        fromDate.setFullYear(fromDate.getFullYear() - 1)

        const params = {
          currency: this.currencyPair,

          format: 'records',
          interval: 'daily',

          start_date: [
            fromDate.getFullYear(),
            String(fromDate.getMonth() + 1).padStart(2, '0'),
            String(fromDate.getDate()).padStart(2, '0')
          ].join('-'),

          end_date: [
            toDate.getFullYear(),
            String(toDate.getMonth() + 1).padStart(2, '0'),
            String(toDate.getDate()).padStart(2, '0')
          ].join('-')
        }

        return axios.get('/timeseries', { params }).then((resp) => {
          this.data = resp.data.quotes.reduce(
            (data, quote) => {
              data.push(
                {
                  label: quote.date,
                  data: quote.close
                }
              )
              return data
            }, []
          )
        })
      },

      get1HData() {
        const toDate = new window.Date()
        toDate.setDate(toDate.getDate() - 1)

        const fromDate = new window.Date()
        fromDate.setMonth(fromDate.getMonth() - 1)

        const params = {
          currency: this.currencyPair,

          format: 'records',
          interval: 'hourly',

          start_date: [
            fromDate.getFullYear(),
            String(fromDate.getMonth() + 1).padStart(2, '0'),
            String(fromDate.getDate()).padStart(2, '0')
          ].join('-'),

          end_date: [
            toDate.getFullYear(),
            String(toDate.getMonth() + 1).padStart(2, '0'),
            String(toDate.getDate()).padStart(2, '0')
          ].join('-')
        }

        return axios.get('/timeseries', { params }).then((resp) => {
          this.data = resp.data.quotes.reduce(
            (data, quote) => {
              data.push(
                {
                  label: quote.date,
                  data: quote.close
                }
              )
              return data
            }, []
          )
        })
      },

      get15MData () {
        const toDate = new window.Date()
        toDate.setDate(toDate.getDate() - 1)

        const fromDate = new window.Date()
        fromDate.setDate(fromDate.getDate() - 3)

        const params = {
          period: 15,

          currency: this.currencyPair,

          format: 'records',
          interval: 'minute',

          start_date: [
            fromDate.getFullYear(),
            String(fromDate.getMonth() + 1).padStart(2, '0'),
            String(fromDate.getDate()).padStart(2, '0')
          ].join('-'),

          end_date: [
            toDate.getFullYear(),
            String(toDate.getMonth() + 1).padStart(2, '0'),
            String(toDate.getDate()).padStart(2, '0')
          ].join('-')
        }

        return axios.get('/timeseries', { params }).then((resp) => {
          this.data = resp.data.quotes.reduce(
            (data, quote) => {
              data.push(
                {
                  label: quote.date,
                  data: quote.close
                }
              )
              return data
            }, []
          )
        })
      },

      refreshData() {
        this.loading = true

        ;(
          this.frequency === '15M'
            ? this.get15MData()
            : this.frequency === '1H'
            ? this.get1HData()
            : this.frequency === '1D'
            ? this.get1DData()
            : Promise.resolve()
        ).catch(err => {
          console.error(err)
        }).then(() => this.loading = false)
      },

      onFrequencyChange: function (frequency) {
        this.frequency = frequency
      }
    }
  }
</script>

<template>
  <div class="Exchanges">
    <div v-if="loading" class="ExchangesLoading">
      <Loader message="Retrieving data" />
    </div>

    <template v-else>
      <header class="ExchangesHeader">
        <div class="ExchangesHeaderSymbols">
          <Flag :code="codeFrom"/>
          <Flag :code="codeTo"/>
          <span class="ExchangesHeaderSymbolsExchangeName">Forex.com</span>
        </div>

        <div class="ExchangesHeaderSummary">
          <h3 class="ExchangesHeaderSummaryCurrencies">
            EUR/USD
          </h3>

          <div class="ExchangesHeaderSummaryOverview">
            <span class="ExchangesHeaderSummaryDifference">$1.000830</span>
            <span class="ExchangesHeaderSummaryPercentage">0.000060 (0.005995%)</span>
          </div>
        </div>
      </header>

      <div class="ExchangesChart">
        <LineChart :data="chartData" :options="chartOptions" />
      </div>

      <div class="ExchangesFrequencies">

        <Tab
          :key="name"
          v-for="name in frequencies"
          :selected="frequency === name"
          @click.native="onFrequencyChange(name)">
          {{ name }}
        </Tab>
      </div>
    </template>
  </div>
</template>

<style scoped>
  .Exchanges {
    gap: 32px;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-radius: 6px;
    padding: 20px 16px;
    min-height: 516px;
    box-shadow: 0px 5px 15px -6px rgba(0,0,0,.5);
  }

  .ExchangesLoading {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ExchangesHeader {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ExchangesHeaderSymbols {
    gap: 8px;
    display: flex;
    align-items: center;
  }

  .ExchangesHeaderSymbolsExchangeName {
    color: #6b7280;
    background-color: #f3f4f6;
    font-weight: bold;
    padding: 7px 12px;
    border-radius: 15px;
  }

  .ExchangesHeaderSummary {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;;
  }

  .ExchangesHeaderSummaryOverview {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-end;
  }

  .ExchangesHeaderSummaryCurrencies {
    font-size: 2em;
    font-weight: bold;
  }

  .ExchangesHeaderSummaryDifference {
    font-size: 2em;
  }

  .ExchangesHeaderSummaryPercentage {
    color: #00996b;
    font-weight: bold;
  }

  .ExchangesChart {
    width: 100%;
    height: 300px;
    position:relative
  }

  .ExchangesFrequencies {
    gap: 8px;
    display: flex;
    justify-content: center;
  }

  @media (max-width: 500px) {
    .ExchangesHeaderSummary {
      flex-direction: column;
    }

    .ExchangesHeaderSummaryOverview {
      align-items: flex-start;
    }
  }
</style>
