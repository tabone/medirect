<script>
  import axios from "./axios"
  import Page from "./components/Page.vue"
  import Select from "./components/Select.vue"
  import Exchanges from "./components/Exchanges.vue"

  export default {
    components: {
      Page,
      Select,
      Exchanges
    },

    data: () => {
      return {
        codeTo: null,
        codeFrom: null,
        loading: false
      }
    },

    mounted: function mounted () {
      this.loading = true

      axios.get('/live_currencies_list').then((resp) => {
        this.$root.onCurrenciesChange(
          Object.keys(resp.data.available_currencies)
        )
      }).catch((err) => {
        console.error(err)
        this.$toast.error('An error occured while retrieving list of currencies.')
      }).then(() => {
        this.loading = false
      })
    },

    computed: {
      isChartVisible: function isChartVisible () {
        return [this.codeTo, this.codeFrom].includes(null) === false
      }
    }
  }
</script>

<template>
  <Page
    :loading="loading"
    title="Forex Exchange"
    subtitle="Checkout the current price for a currency pair" >
    <div class="HomePage">
      <div class="HomePageConfiguration">
        <Select fullWidth v-model="codeFrom" aria-label="Currency From">
          <option :key="currency" v-for="currency in $root.currencies" :value="currency">
            {{ currency }}
          </option>
        </Select>

        <Select fullWidth v-model="codeTo" aria-label="Currency To">
          <option
            v-for="currency in $root.currencies"
            :key="currency"
          >{{ currency }}</option>
        </Select>
      </div>

      <Exchanges
        v-if="isChartVisible"
        :codeTo="codeTo"
        :codeFrom="codeFrom"
        class="HomePageChart"
      />
    </div>
  </Page>
</template>

<style scoped>
  .HomePage {
    gap: 24px;
    display: flex;
    align-items: center;
  }

  .HomePageConfiguration {
    flex: 1 0 200px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .HomePageChart {
    flex: 0 1 700px;
  }

  @media (max-width: 1000px) {
    .HomePage {
      flex-direction: column;
    }

    .HomePageConfiguration {
      width: 100%;
    }

    .HomePageChart {
      width: 100%;
    }
  }
</style>
