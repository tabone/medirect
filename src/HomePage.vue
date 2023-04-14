<script>
  import Page from "./components/Page.vue"
  import Select from "./components/Select.vue"
  import Exchanges from "./components/Exchanges.vue"

  export default {
    data: () => {
      return {
        codeTo: null,
        codeFrom: null
      }
    },

    components: {
      Page,
      Select,
      Exchanges
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

      <div v-if="isChartVisible" class="HomePageChart">
        <Exchanges :codeFrom="codeFrom" :codeTo="codeTo" />
      </div>
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
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .HomePageChart {
    flex: 2;
  }

  @media (max-width: 700px) {
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
