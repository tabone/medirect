import { render, screen, within } from '@testing-library/vue'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import LineChart from '../LineChart.vue'

vi.mock('chart.js/auto', () => {
  return {
    default: function () {}
  }
})

describe('<LineChart /> Unit Tests', () => {
  let info = null

  afterEach(() => {
    info.unmount()
  })

  describe('Rendering a <LineChart />', () => {
    describe('When rendering a <LineChart />', () => {
      beforeEach(() => {
        info = render(LineChart, {
          props: {
            options: {},
            name: 'test-name',
            data: {
              labels: ['2023-03-16', '2023-03-17', '2023-03-20', '2023-03-21'],
              datasets: [
                {
                  data: [0.034, 0.0341, 0.0336, 0.0336],
                  fill: 'origin',
                  pointRadius: 0,
                  label: 'test-name',
                  borderColor: '#7bc414',
                  backgroundColor: '#f2f9ea'
                }
              ]
            }
          }
        })
      })

      it('should render the details for screen readers', () => {
        const table = screen.getByRole('table')

        const rows = within(table).getAllByRole('row')

        ;[
          ['Dates', 'test-name'],
          ['2023-03-16', 0.034],
          ['2023-03-17', 0.0341],
          ['2023-03-20', 0.0336],
          ['2023-03-21', 0.0336]
        ].forEach(([cellOneContent, cellTwoContent], index) => {
          const cells = within(rows[index]).getAllByRole(
            index === 0 ? 'columnheader' : 'cell'
          )

          expect(within(cells[0]).getByText(cellOneContent)).not.toBeNull()
          expect(within(cells[1]).getByText(cellTwoContent)).not.toBeNull()
        })
      })
    })
  })
})
