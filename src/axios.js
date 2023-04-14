import axios from 'axios'

const client = axios.create({
  baseURL: 'https://marketdata.tradermade.com/api/v1/'
})

client.interceptors.request.use((config) => {
  const newConfig = { ...config }

  newConfig.params = { ...newConfig.params, api_key: 'p2738l3rgbrne-lIBMWY' }

  return newConfig
})

export default client
