export default {
  currencies: [],

  onCurrenciesChange(newCurrencies) {
    this.currencies = [...newCurrencies]
  }
}
