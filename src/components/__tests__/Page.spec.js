import { render, screen } from '@testing-library/vue'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import Page from '../Page.vue'

describe('<Page /> Unit Tests', () => {
  let info = null

  afterEach(() => {
    info.unmount()
  })

  describe('Rendering a Page', () => {
    beforeEach(() => {
      info = render(Page, {
        props: {
          title: 'test-title',
          subtitle: 'test-subtitle'
        },
        slots: {
          default: 'test-content'
        }
      })
    })

    it('should display the title', () => {
      expect(
        screen.getByRole('heading', {
          name: 'test-title'
        })
      ).not.toBeNull()
    })

    it('should display the sub title', () => {
      expect(
        screen.getByRole('heading', {
          name: 'test-subtitle'
        })
      ).not.toBeNull()
    })

    it('should by default not be in a loading state', () => {
      expect(screen.queryByText("We'll be right with you!")).toBeNull()
    })
  })

  describe('Rendering a Page without a subtitle', () => {
    beforeEach(() => {
      info = render(Page, {
        props: {
          title: 'test-title'
        },
        slots: {
          default: 'test-content'
        }
      })
    })

    it('should display the title', () => {
      expect(screen.getAllByRole('heading').length).toBe(1)

      expect(
        screen.getByRole('heading', {
          name: 'test-title'
        })
      ).not.toBeNull(1)
    })
  })

  describe('Rendering a Page in a loading state', () => {
    beforeEach(() => {
      info = render(Page, {
        props: {
          loading: true,
          title: 'test-title',
          subtitle: 'test-subtitle'
        },
        slots: {
          default: 'test-content'
        }
      })
    })

    it('should not display the title', () => {
      expect(
        screen.queryByRole('heading', {
          name: 'test-title'
        })
      ).toBeNull()
    })

    it('should not display the sub title', () => {
      expect(
        screen.queryByRole('heading', {
          name: 'test-subtitle'
        })
      ).toBeNull()
    })

    it('should inform the user that the page is loading', () => {
      expect(screen.getByText("We'll be right with you!")).not.toBeNull()
    })
  })
})
