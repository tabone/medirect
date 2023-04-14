<script>
  import Tab from "./Tab.vue"
  import Flag from "./Flag.vue"

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
        frequency: '1H',
        frequencies: ['15M', '1H', '1D', '1W', '1M']
      }
    },

    components: {
      Tab,
      Flag
    },

    methods: {
      onFrequencyChange: function (frequency) {
        this.frequency = frequency
      }
    }
  }
</script>

<template>
  <div class="Exchanges">
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
  </div>
</template>

<style scoped>
  .Exchanges {
    gap: 8px;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-radius: 6px;
    padding: 20px 16px;
    box-shadow: 0px 5px 15px -6px rgba(0,0,0,.5);
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
