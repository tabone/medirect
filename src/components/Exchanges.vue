<script>
  import Tab from "./Tab.vue"
  import Flag from "./Flag.vue"
  import Card from "./Card.vue"
  import Loader from "./Loader.vue"
  import LineChart from "./LineChart.vue"

  import axios from "../axios"

  function formatDate (date) {
    return [
      date.getUTCFullYear(),
      String(date.getUTCMonth() + 1).padStart(2, '0'),
      String(date.getUTCDate()).padStart(2, '0'),
      [
        String(date.getUTCHours()).padStart(2, '0'),
        String(date.getUTCMinutes()).padStart(2, '0')
      ].join(':')
    ].join('-')
}

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

    components: {
      Tab,
      Flag,
      Card,
      Loader,
      LineChart
    },

    data: () => {
      return {
        data: [],
        range: '1W',
        loading: true
      }
    },

    mounted: function mounted () {
      this.refreshData()
    },

    watch: {
      range: function range () {
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

      ranges: function ranges () {
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
      },

      startingPrice: function startingPrice () {
        return this.data[0]?.data
      },

      currentPrice: function currentPrice () {
        return this.data[this.data.length - 1]?.data
      },

      difference: function difference () {
        return this.startingPrice == null || this.currentPrice == null
          ? 0
          : this.currentPrice - this.startingPrice
      },

      currentPriceLabel: function differenceLabel () {
        return this.codeTo == null ? null : new Intl.NumberFormat(
          'en-IN',
          {
            style: 'currency',
            currency: this.codeTo,
            maximumSignificantDigits: 6
          }
        ).format(this.currentPrice)
      },

      differenceLabel: function differenceLabel () {
        return this.codeTo == null ? null : new Intl.NumberFormat(
          'en-IN',
          {
            style: 'currency',
            currency: this.codeTo,
            maximumSignificantDigits: 6
          }
        ).format(this.difference)
      },

      differencePercentage: function differencePercentage () {
        const percentage = (
          (this.currentPrice - this.startingPrice) / this.startingPrice* 100
        ).toFixed(6)

        return `${percentage}%`
      }
    },

    methods: {
      get1MData() {
        const toDate = new window.Date()

        const fromDate = new window.Date()
        fromDate.setMonth(fromDate.getMonth() - 1)

        const params = {
          currency: this.currencyPair,

          period: 1,
          format: 'records',
          interval: 'daily',

          end_date: formatDate(toDate),
          start_date: formatDate(fromDate)
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

      get1WData() {
        const toDate = new window.Date()

        const fromDate = new window.Date()
        fromDate.setDate(fromDate.getDate() - 7)

        const params = {
          currency: this.currencyPair,

          period: 1,
          format: 'records',
          interval: 'hourly',

          end_date: formatDate(toDate),
          start_date: formatDate(fromDate)
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

      get1DData() {
        const toDate = new window.Date()

        const fromDate = new window.Date()
        fromDate.setDate(fromDate.getDate() - 1)

        const params = {
          currency: this.currencyPair,

          period: 1,
          format: 'records',
          interval: 'hourly',

          end_date: formatDate(toDate),
          start_date: formatDate(fromDate)
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

        const fromDate = new window.Date()
        fromDate.setHours(fromDate.getHours() - 1)

        const params = {
          currency: this.currencyPair,

          period: 1,
          format: 'records',
          interval: 'minute',

          end_date: formatDate(toDate),
          start_date: formatDate(fromDate)
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

        const fromDate = new window.Date()
        fromDate.setMinutes(fromDate.getMinutes() - 15)

        const params = {
          period: 1,

          format: 'records',
          interval: 'minute',
          currency: this.currencyPair,

          end_date: formatDate(toDate),
          start_date: formatDate(fromDate)
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
          this.range === '15M'
            ? this.get15MData()
            : this.range === '1H'
            ? this.get1HData()
            : this.range === '1D'
            ? this.get1DData()
            : this.range === '1W'
            ? this.get1WData()
            : this.range === '1M'
            ? this.get1MData()
            : Promise.resolve()
        ).catch(err => {
          console.error(err)

          this.$toast.error(
            'An error occured while retrieving the exchange rates.'
          )
        }).then(() => this.loading = false)
      },

      onRangeChange: function (range) {
        this.range = range
      }
    }
  }
</script>

<template>
  <Card class="Exchanges">
    <div v-if="loading" class="ExchangesLoading">
      <Loader message="Retrieving data" />
    </div>

    <template v-else>
      <header class="ExchangesHeader">
        <div class="ExchangesHeaderSymbols">
          <Flag :code="codeFrom"/>
          <Flag :code="codeTo"/>
          <span class="ExchangesHeaderSymbolsExchangeName" aria-label="Exchange">Forex.com</span>
        </div>

        <div class="ExchangesHeaderSummary">
          <h3
            aria-label="Currency Pair"
            class="ExchangesHeaderSummaryCurrencies">{{ codeFrom }}/{{ codeTo }}</h3>

          <div class="ExchangesHeaderSummaryOverview">
            <span class="ExchangesHeaderSummaryDifference" aria-label="Current Price">{{currentPriceLabel}}</span>

            <span class="ExchangesHeaderSummaryPercentage">
              <span aria-label="Difference">{{differenceLabel}}</span>
              <span aria-label="Percentage Difference">({{ differencePercentage }})</span>
            </span>
          </div>
        </div>
      </header>

      <div class="ExchangesChart">
        <LineChart
          :data="chartData"
          :name="currencyPair"
          :options="chartOptions" />
      </div>

      <div class="ExchangesRanges">
        <Tab
          :key="label"
          :label="label"
          v-for="label in ranges"
          :selected="range === label"
          @onClick="onRangeChange(label)" />
      </div>
    </template>
  </Card>
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

  .ExchangesRanges {
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
