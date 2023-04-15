import Vue from 'vue'
import AxiosMockAdapter from 'axios-mock-adapter'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitForElementToBeRemoved } from '@testing-library/vue'

import { default as axios, apiKey } from '../../axios'

import Exchanges from '../Exchanges.vue'

function parseDate(dateSTR) {
  const [year, month, date, time] = dateSTR.split('-')
  const [hours, minutes] = time.split(':')

  return new window.Date(
    Date.UTC(Number(year), Number(month) - 1, Number(date), hours, minutes)
  )
}

vi.mock('chart.js/auto', () => {
  return {
    default: function () {}
  }
})

describe('<Exchanges /> Unit Tests', () => {
  let info = null
  let mockedClients = null
  let originalToast = null

  beforeEach(() => {
    mockedClients = mockAxios()

    originalToast = Vue.prototype.$toast
    Vue.prototype.$toast = { error: vi.fn() }
  })

  afterEach(() => {
    info.unmount()
    Vue.prototype.$toast = originalToast
  })

  describe('Rendering the <Exchanges /> component', () => {
    describe('When rendering the <Exchanges /> component', () => {
      beforeEach(async () => {
        mockedClients.axiosMock.onGet('/timeseries').reply(200, {
          quotes: [
            {
              close: 1.00077,
              date: 'test-date-one'
            },
            {
              close: 2,
              date: 'test-date-two'
            },
            {
              close: 3,
              date: 'test-date-three'
            },
            {
              close: 1.00083,
              date: 'test-date-four'
            }
          ]
        })

        info = render(Exchanges, {
          props: {
            codeFrom: 'EUR',
            codeTo: 'USD'
          }
        })

        await waitForElementToBeRemoved(info.queryByText('Retrieving data'))
      })

      it('should make an HTTP Request to retrieve the historical exchange rates of the last week', () => {
        const getCalls = mockedClients.axiosMock.history.get

        expect(getCalls.length).toBe(1)
        expect(getCalls[0].url).toBe('/timeseries')

        const toDate = new window.Date()
        const fromDate = new window.Date()
        fromDate.setDate(fromDate.getDate() - 7)

        const {
          period,
          format,
          api_key,
          currency,
          interval,
          end_date,
          start_date
        } = getCalls[0].params

        expect({
          period,
          format,
          api_key,
          currency,
          interval
        }).toEqual({
          period: 1,
          api_key: apiKey,
          format: 'records',
          interval: 'hourly',
          currency: 'EURUSD'
        })

        // 5 minutes threshold
        expect(Math.abs(parseDate(end_date) - toDate) < 300000).toBeTruthy()
        expect(Math.abs(parseDate(start_date) - fromDate) < 300000).toBeTruthy()
      })

      it('should by default have the 1 Week range selected', () => {
        expect(
          screen.getByRole('checkbox', {
            name: '1W',
            checked: true
          })
        ).not.toBeNull()
      })

      it('should display the flags of the currency pair', () => {
        expect(screen.getByLabelText('Flag of EUR')).not.toBeNull()
        expect(screen.getByLabelText('Flag of USD')).not.toBeNull()
      })

      it('should display the names of the currency pair', () => {
        expect(screen.getByLabelText('Currency Pair').innerHTML).toBe('EUR/USD')
      })

      it('should display the name of the exchange', () => {
        expect(screen.getByLabelText('Exchange').innerHTML).toBe('Forex.com')
      })

      it('should display the current price', () => {
        expect(screen.getByLabelText('Current Price').innerHTML).toBe(
          '$1.00083'
        )
      })

      it('should display the difference between the starting and ending price', () => {
        expect(screen.getByLabelText('Difference').innerHTML).toBe('$0.00006')
      })

      it('should display the percentage difference between the starting and ending price', () => {
        expect(screen.getByLabelText('Percentage Difference').innerHTML).toBe(
          '(0.005995%)'
        )
      })
    })
  })

  describe('Failing to retrieve the exchange rates', () => {
    describe('When failing to retrieve the exchange rates', () => {
      beforeEach(async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {})

        mockedClients.axiosMock.onGet('/timeseries').reply(500)

        info = render(Exchanges, {
          props: {
            codeFrom: 'EUR',
            codeTo: 'USD'
          }
        })

        await waitForElementToBeRemoved(info.queryByText('Retrieving data'))
      })

      afterEach(() => {
        console.error.restore()
      })

      it('should inform the user that an error has occured', () => {
        expect(Vue.prototype.$toast.error).toHaveBeenCalledTimes(1)

        expect(Vue.prototype.$toast.error).toHaveBeenCalledWith(
          'An error occured while retrieving the exchange rates.'
        )
      })

      it('should log the error to the console', () => {
        expect(console.error).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Retrieving the historical exchange rates of the last 15 minutes', () => {
    describe('Given an <Exchanges /> component', () => {
      beforeEach(async () => {
        mockedClients.axiosMock.onGet('/timeseries').reply(200, {
          quotes: [
            {
              close: 1.00077,
              date: 'test-date-one'
            },
            {
              close: 2,
              date: 'test-date-two'
            },
            {
              close: 3,
              date: 'test-date-three'
            },
            {
              close: 1.00083,
              date: 'test-date-four'
            }
          ]
        })

        info = render(Exchanges, {
          props: {
            codeFrom: 'EUR',
            codeTo: 'USD'
          }
        })

        await waitForElementToBeRemoved(info.queryByText('Retrieving data'))
      })

      describe('when attempting to retrieve the historical exchange rates of the last 15 minutes', () => {
        beforeEach(async () => {
          mockedClients.axiosMock.resetHistory()

          await userEvent.click(
            screen.getByRole('checkbox', {
              name: '15M'
            })
          )
        })

        it('should make an HTTP Request to retrieve the historical exchange rates accordingly', () => {
          const getCalls = mockedClients.axiosMock.history.get

          expect(getCalls.length).toBe(1)
          expect(getCalls[0].url).toBe('/timeseries')

          const toDate = new window.Date()
          const fromDate = new window.Date()
          fromDate.setMinutes(fromDate.getMinutes() - 15)

          const {
            period,
            format,
            api_key,
            currency,
            interval,
            end_date,
            start_date
          } = getCalls[0].params

          expect({
            period,
            format,
            api_key,
            currency,
            interval
          }).toEqual({
            period: 1,
            api_key: apiKey,
            format: 'records',
            interval: 'minute',
            currency: 'EURUSD'
          })

          // 5 minutes threshold
          expect(Math.abs(parseDate(end_date) - toDate) < 300000).toBeTruthy()
          expect(
            Math.abs(parseDate(start_date) - fromDate) < 300000
          ).toBeTruthy()
        })

        it('should select 15M checkbox', () => {
          expect(
            screen.getByRole('checkbox', {
              name: '15M',
              checked: true
            })
          ).not.toBeNull()
        })

        it('should unselect the other checkbox', () => {
          expect(
            screen.queryByRole('checkbox', {
              name: '1W',
              checked: true
            })
          ).toBeNull()
        })
      })
    })
  })

  describe('Retrieving the historical exchange rates of the last hour', () => {
    describe('Given an <Exchanges /> component', () => {
      beforeEach(async () => {
        mockedClients.axiosMock.onGet('/timeseries').reply(200, {
          quotes: [
            {
              close: 1.00077,
              date: 'test-date-one'
            },
            {
              close: 2,
              date: 'test-date-two'
            },
            {
              close: 3,
              date: 'test-date-three'
            },
            {
              close: 1.00083,
              date: 'test-date-four'
            }
          ]
        })

        info = render(Exchanges, {
          props: {
            codeFrom: 'EUR',
            codeTo: 'USD'
          }
        })

        await waitForElementToBeRemoved(info.queryByText('Retrieving data'))
      })

      describe('when attempting to retrieve the historical exchange rates of the last hour', () => {
        beforeEach(async () => {
          mockedClients.axiosMock.resetHistory()

          await userEvent.click(
            screen.getByRole('checkbox', {
              name: '1H'
            })
          )
        })

        it('should make an HTTP Request to retrieve the historical exchange rates accordingly', () => {
          const getCalls = mockedClients.axiosMock.history.get

          expect(getCalls.length).toBe(1)
          expect(getCalls[0].url).toBe('/timeseries')

          const toDate = new window.Date()
          const fromDate = new window.Date()
          fromDate.setHours(fromDate.getHours() - 1)

          const {
            period,
            format,
            api_key,
            currency,
            interval,
            end_date,
            start_date
          } = getCalls[0].params

          expect({
            period,
            format,
            api_key,
            currency,
            interval
          }).toEqual({
            period: 1,
            api_key: apiKey,
            format: 'records',
            interval: 'minute',
            currency: 'EURUSD'
          })

          // 5 minutes threshold
          expect(Math.abs(parseDate(end_date) - toDate) < 300000).toBeTruthy()
          expect(
            Math.abs(parseDate(start_date) - fromDate) < 300000
          ).toBeTruthy()
        })

        it('should select 15M checkbox', () => {
          expect(
            screen.getByRole('checkbox', {
              name: '1H',
              checked: true
            })
          ).not.toBeNull()
        })

        it('should unselect the other checkbox', () => {
          expect(
            screen.queryByRole('checkbox', {
              name: '1W',
              checked: true
            })
          ).toBeNull()
        })
      })
    })
  })

  describe('Retrieving the historical exchange rates of the last day', () => {
    describe('Given an <Exchanges /> component', () => {
      beforeEach(async () => {
        mockedClients.axiosMock.onGet('/timeseries').reply(200, {
          quotes: [
            {
              close: 1.00077,
              date: 'test-date-one'
            },
            {
              close: 2,
              date: 'test-date-two'
            },
            {
              close: 3,
              date: 'test-date-three'
            },
            {
              close: 1.00083,
              date: 'test-date-four'
            }
          ]
        })

        info = render(Exchanges, {
          props: {
            codeFrom: 'EUR',
            codeTo: 'USD'
          }
        })

        await waitForElementToBeRemoved(info.queryByText('Retrieving data'))
      })

      describe('when attempting to retrieve the historical exchange rates of the last day', () => {
        beforeEach(async () => {
          mockedClients.axiosMock.resetHistory()

          await userEvent.click(
            screen.getByRole('checkbox', {
              name: '1D'
            })
          )
        })

        it('should make an HTTP Request to retrieve the historical exchange rates accordingly', () => {
          const getCalls = mockedClients.axiosMock.history.get

          expect(getCalls.length).toBe(1)
          expect(getCalls[0].url).toBe('/timeseries')

          const toDate = new window.Date()
          const fromDate = new window.Date()
          fromDate.setDate(fromDate.getDate() - 1)

          const {
            period,
            format,
            api_key,
            currency,
            interval,
            end_date,
            start_date
          } = getCalls[0].params

          expect({
            period,
            format,
            api_key,
            currency,
            interval
          }).toEqual({
            period: 1,
            api_key: apiKey,
            format: 'records',
            interval: 'hourly',
            currency: 'EURUSD'
          })

          // 5 minutes threshold
          expect(Math.abs(parseDate(end_date) - toDate) < 300000).toBeTruthy()
          expect(
            Math.abs(parseDate(start_date) - fromDate) < 300000
          ).toBeTruthy()
        })

        it('should select 15M checkbox', () => {
          expect(
            screen.getByRole('checkbox', {
              name: '1D',
              checked: true
            })
          ).not.toBeNull()
        })

        it('should unselect the other checkbox', () => {
          expect(
            screen.queryByRole('checkbox', {
              name: '1W',
              checked: true
            })
          ).toBeNull()
        })
      })
    })
  })

  describe('Retrieving the historical exchange rates of the last month', () => {
    describe('Given an <Exchanges /> component', () => {
      beforeEach(async () => {
        mockedClients.axiosMock.onGet('/timeseries').reply(200, {
          quotes: [
            {
              close: 1.00077,
              date: 'test-date-one'
            },
            {
              close: 2,
              date: 'test-date-two'
            },
            {
              close: 3,
              date: 'test-date-three'
            },
            {
              close: 1.00083,
              date: 'test-date-four'
            }
          ]
        })

        info = render(Exchanges, {
          props: {
            codeFrom: 'EUR',
            codeTo: 'USD'
          }
        })

        await waitForElementToBeRemoved(info.queryByText('Retrieving data'))
      })

      describe('when attempting to retrieve the historical exchange rates of the last month', () => {
        beforeEach(async () => {
          mockedClients.axiosMock.resetHistory()

          await userEvent.click(
            screen.getByRole('checkbox', {
              name: '1M'
            })
          )
        })

        it('should make an HTTP Request to retrieve the historical exchange rates accordingly', () => {
          const getCalls = mockedClients.axiosMock.history.get

          expect(getCalls.length).toBe(1)
          expect(getCalls[0].url).toBe('/timeseries')

          const toDate = new window.Date()
          const fromDate = new window.Date()
          fromDate.setMonth(fromDate.getMonth() - 1)

          const {
            period,
            format,
            api_key,
            currency,
            interval,
            end_date,
            start_date
          } = getCalls[0].params

          expect({
            period,
            format,
            api_key,
            currency,
            interval
          }).toEqual({
            period: 1,
            api_key: apiKey,
            format: 'records',
            interval: 'daily',
            currency: 'EURUSD'
          })

          // 5 minutes threshold
          expect(Math.abs(parseDate(end_date) - toDate) < 300000).toBeTruthy()
          expect(
            Math.abs(parseDate(start_date) - fromDate) < 300000
          ).toBeTruthy()
        })

        it('should select 15M checkbox', () => {
          expect(
            screen.getByRole('checkbox', {
              name: '1M',
              checked: true
            })
          ).not.toBeNull()
        })

        it('should unselect the other checkbox', () => {
          expect(
            screen.queryByRole('checkbox', {
              name: '1W',
              checked: true
            })
          ).toBeNull()
        })
      })
    })
  })
})

function mockAxios() {
  const axiosMock = new AxiosMockAdapter(axios)

  return {
    axiosMock
  }
}
