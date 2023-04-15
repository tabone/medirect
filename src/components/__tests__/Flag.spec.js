import { render, screen } from '@testing-library/vue'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import Flag from '../Flag.vue'

describe('<Flag />', () => {
  let info = null

  afterEach(() => {
    info.unmount()
  })

  describe('Rendering a <Flag />', () => {
    describe('When rendering a <Flag />', () => {
      beforeEach(() => {
        info = render(Flag, {
          props: {
            code: 'USD'
          }
        })
      })

      it('should render the <Flag /> with the provided content', () => {
        const element = screen.getByLabelText('Flag of USD')

        expect(element).not.toBeUndefined()

        expect(
          [...element.classList].includes('currency-flag-usd')
        ).toBeTruthy()
      })
    })
  })
})
