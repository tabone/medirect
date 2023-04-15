import { render, screen } from '@testing-library/vue'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import Card from '../Card.vue'

describe('<Card />', () => {
  let info = null

  afterEach(() => {
    info.unmount()
  })

  describe('Rendering a <Card />', () => {
    describe('When rendering a <Card />', () => {
      beforeEach(() => {
        info = render(Card, {
          slots: {
            default: 'test-content'
          }
        })
      })

      it('should render the <Card /> with the provided content', () => {
        expect(screen.getByText('test-content')).not.toBeUndefined()
      })
    })
  })
})
