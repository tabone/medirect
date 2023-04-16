import axios from 'axios'

export const apiKey = 'p2738l3rgbrne-lIBMWY'

const client = axios.create({
  baseURL: 'https://marketdata.tradermade.com/api/v1/'
})

client.interceptors.request.use((config) => {
  const newConfig = { ...config }

  newConfig.params = { ...newConfig.params, api_key: apiKey }

  return newConfig
})

export default client
