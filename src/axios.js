import axios from 'axios'

const client = axios.create({
  baseURL: 'https://marketdata.tradermade.com/api/v1/'
})

export const apiKey = 'p2738l3rgbrne-lIBMWY'

client.interceptors.request.use((config) => {
  const newConfig = { ...config }

  newConfig.params = { ...newConfig.params, api_key: apiKey }

  return newConfig
})

export default client
