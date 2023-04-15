import userEvent from '@testing-library/user-event'
import { render, screen, act } from '@testing-library/vue'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import Tab from '../Tab.vue'

describe('<Tab />', () => {
  let info = null

  afterEach(() => {
    info.unmount()
  })

  describe('Rendering a <Tab />', () => {
    describe('When rendering a <Tab />', () => {
      beforeEach(() => {
        info = render(Tab, {
          props: {
            label: 'test-message'
          }
        })
      })

      it('should render a <Tab /> with the provided label', () => {
        expect(
          screen.getByRole('checkbox', {
            name: 'test-message'
          })
        ).not.toBeNull()
      })

      it('should by default be unselected', () => {
        expect(
          screen.queryByRole('checkbox', {
            checked: true,
            name: 'test-message'
          })
        ).toBeNull()
      })
    })
  })

  describe('Rendering a selected <Tab />', () => {
    describe('When rendering a selected <Tab />', () => {
      beforeEach(() => {
        info = render(Tab, {
          props: {
            selected: true,
            label: 'test-message'
          }
        })
      })

      it('should render the <Tab /> in the selected mode', () => {
        expect(
          screen.getByRole('checkbox', {
            checked: true,
            name: 'test-message'
          })
        ).not.toBeNull()
      })
    })
  })

  describe('Rendering a unselected <Tab />', () => {
    describe('When rendering an unselected <Tab />', () => {
      beforeEach(() => {
        info = render(Tab, {
          props: {
            selected: false,
            label: 'test-message'
          }
        })
      })

      it('should render the <Tab /> in the unselected mode', () => {
        expect(
          screen.queryByRole('checkbox', {
            checked: true,
            name: 'test-message'
          })
        ).toBeNull()
      })
    })
  })

  describe('Clicking on a <Tab />', () => {
    describe('Given a <Tab />', () => {
      beforeEach(() => {
        info = render(Tab, {
          props: {
            onClick: () => console.log('OLA'),
            label: 'test-message'
          }
        })
      })

      describe('when clicking on the <Tab />', () => {
        beforeEach(async () => {
          await userEvent.click(
            screen.getByRole('checkbox', {
              name: 'test-message'
            })
          )
        })

        it('should trigger the onClick listener', () => {
          expect(info.emitted().onClick.length).toBe(1)
        })
      })
    })
  })
})
