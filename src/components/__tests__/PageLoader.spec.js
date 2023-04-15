import { render, screen } from '@testing-library/vue'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import PageLoader from '../PageLoader.vue'

describe('<PageLoader /> Unit Tests', () => {
  let info = null

  afterEach(() => {
    info.unmount()
  })

  describe('Rendering a <PageLoader /> without a message', () => {
    describe('When rendering a <PageLoader /> without a message', () => {
      beforeEach(() => {
        info = render(PageLoader)
      })

      it('should render a <PageLoader /> with a default message', () => {
        expect(screen.getByText("We'll be right with you!")).not.toBeUndefined()
      })
    })
  })

  describe('Rendering a <PageLoader /> with a message', () => {
    describe('When rendering a <PageLoader /> with a message', () => {
      beforeEach(() => {
        info = render(PageLoader, {
          props: {
            message: 'test-message'
          }
        })
      })

      it('should render a <PageLoader /> with the specified message', () => {
        expect(screen.getByText('test-message')).not.toBeUndefined()
      })
    })
  })
})
