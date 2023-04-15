import { render, screen } from '@testing-library/vue'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import Loader from '../Loader.vue'

describe('<Loader />', () => {
  let info = null

  afterEach(() => {
    info.unmount()
  })

  describe('Rendering a <Loader /> without a message', () => {
    describe('When rendering a <Loader /> without a message', () => {
      beforeEach(() => {
        info = render(Loader)
      })

      it('should render a <Loader /> with a default message', () => {
        expect(screen.getByText("We'll be right with you!")).not.toBeUndefined()
      })
    })
  })

  describe('Rendering a <Loader /> with a message', () => {
    describe('When rendering a <Loader /> with a message', () => {
      beforeEach(() => {
        info = render(Loader, {
          props: {
            message: 'test-message'
          }
        })
      })

      it('should render a <Loader /> with the specified message', () => {
        expect(screen.getByText('test-message')).not.toBeUndefined()
      })
    })
  })
})
