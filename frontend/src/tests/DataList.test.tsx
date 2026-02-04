import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DataList from '../components/DataList'
import * as api from '../api'
import { vi, describe, test, expect } from 'vitest'

// Create a mock implementation that satisfies both tests
vi.spyOn(api, 'fetchComments').mockImplementation(async (page = 1, limit = 20, search = '') => {
  return {
    items: [
      { id: 1, postId: 1, name: 'Cheese', email: 'cheese@example.com', body: 'I love cheese' },
      { id: 2, postId: 2, name: 'Bee', email: 'bee@farm.com', body: 'Buzz' },
      { id: 3, postId: 1, name: 'A', email: 'a@a.com', body: 'b' } 
    ],
    total: 3,
    page: 1,
    limit: 20
  }
})

describe('DataList Component', () => {
  
  test('renders list successfully', async () => {
    render(<DataList />)
    expect(await screen.findByText('A')).toBeInTheDocument()
  })

  test('highlights matched search terms in name, email and body', async () => {
    const { container } = render(<DataList />)

    await waitFor(() => expect(screen.getByText('Cheese')).toBeInTheDocument())

    const user = userEvent.setup()
    const searchInput = screen.getByPlaceholderText('Search...')
    
    await user.type(searchInput, 'ee')

    await waitFor(() => {
      const highlights = container.querySelectorAll('.highlight')
      expect(highlights.length).toBeGreaterThan(0)
      
      const hasEe = Array.from(highlights).some(h => /ee/i.test(h.textContent || ''))
      expect(hasEe).toBe(true)
    })
  })
})