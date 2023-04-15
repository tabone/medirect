import Vue from 'vue'
import AxiosMockAdapter from 'axios-mock-adapter'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  render,
  screen,
  within,
  waitForElementToBeRemoved
} from '@testing-library/vue'

import axios from '../axios'

import HomePage from '../HomePage.vue'

describe('<HomePage /> Unit Tests', () => {
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

  describe('Rendering a <HomePage />', () => {
    describe('When rendering a <HomePage />', () => {
      beforeEach(async () => {
        mockedClients.axiosMock.onGet('/live_currencies_list').reply(200, {
          available_currencies: {
            EUR: 'Euro',
            USD: 'US Dollars',
            GBP: 'British Pound Sterling'
          }
        })

        info = render(HomePage)

        await waitForElementToBeRemoved(
          info.queryByText("We'll be right with you!")
        )
      })

      it('should make an HTTP Request to retrieve the list of available currencies', () => {
        const getCalls = mockedClients.axiosMock.history.get

        expect(getCalls.length).toBe(1)
        expect(getCalls[0].url).toBe('/live_currencies_list')
      })

      it('should render the homepage with the correct headings', () => {
        expect(
          screen.getByRole('heading', {
            name: 'Forex Exchange'
          })
        ).not.toBeNull()

        expect(
          screen.getByRole('heading', {
            name: 'Checkout the current price for a currency pair'
          })
        ).not.toBeNull()
      })

      it('should render two dropdowns with the all the available currencies', () => {
        const fromDropdownOptions = within(
          screen.getByRole('combobox', {
            name: 'Currency From'
          })
        ).getAllByRole('option')

        const toDropdownOptions = within(
          screen.getByRole('combobox', {
            name: 'Currency To'
          })
        ).getAllByRole('option')

        expect(fromDropdownOptions.length).toBe(3)
        expect(toDropdownOptions.length).toBe(3)

        expect(fromDropdownOptions.map((option) => option.innerHTML)).toEqual([
          'EUR',
          'USD',
          'GBP'
        ])

        expect(toDropdownOptions.map((option) => option.innerHTML)).toEqual([
          'EUR',
          'USD',
          'GBP'
        ])
      })
    })
  })

  describe('Failing to retrieve the list of available currencies', () => {
    describe('When failing to retrieve the list of available currencies', () => {
      beforeEach(async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {})

        mockedClients.axiosMock.onGet('/live_currencies_list').reply(500)

        info = render(HomePage)

        await waitForElementToBeRemoved(
          info.queryByText("We'll be right with you!")
        )
      })

      it('should inform the user that an error has occured', () => {
        expect(Vue.prototype.$toast.error).toHaveBeenCalledTimes(1)

        expect(Vue.prototype.$toast.error).toHaveBeenCalledWith(
          'An error occured while retrieving list of currencies.'
        )
      })

      it('should log the error to the console', () => {
        expect(console.error).toHaveBeenCalledTimes(1)
      })

      it('should not populate the dropdowns with currencies', () => {
        expect(screen.queryAllByRole('option').length).toBe(0)
      })
    })
  })

  describe('Selecting a currency pair', () => {
    describe('Given a <HomePage />', () => {
      beforeEach(async () => {
        mockedClients.axiosMock.onGet('/live_currencies_list').reply(200, {
          available_currencies: {
            EUR: 'Euro',
            USD: 'US Dollars',
            GBP: 'British Pound Sterling'
          }
        })

        mockedClients.axiosMock.onGet('/timeseries').reply(200, {
          quotes: []
        })

        info = render(HomePage)

        await waitForElementToBeRemoved(
          info.queryByText("We'll be right with you!")
        )
      })

      describe('when choosing a currency pair', () => {
        beforeEach(async () => {
          mockedClients.axiosMock.resetHistory()

          await userEvent.selectOptions(
            info.getByRole('combobox', {
              name: 'Currency From'
            }),
            ['EUR']
          )

          await userEvent.selectOptions(
            info.getByRole('combobox', {
              name: 'Currency To'
            }),
            ['USD']
          )
        })

        it('should display the <Exchanges /> component', () => {
          const getCalls = mockedClients.axiosMock.history.get

          expect(getCalls.length).toBe(1)
          expect(getCalls[0].url).toBe('/timeseries')
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
