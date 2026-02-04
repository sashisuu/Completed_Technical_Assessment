import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FileUpload from '../components/FileUpload'
import * as api from '../api'
import { vi, describe, test, expect, afterEach } from 'vitest'

describe('FileUpload', ()=>{
  afterEach(()=>{
    vi.restoreAllMocks()
  })

  test('displays success message and standard bar on success', async ()=>{
    vi.spyOn(api, 'uploadFile').mockResolvedValue({ inserted: 3, errors: [] } as any)
    render(<FileUpload />)

    const input = screen.getByTestId('file-input')
    const file = new File(['a,b,c'], 'test.csv', { type: 'text/csv' })
    fireEvent.change(input, { target: { files: [file] } })

    await screen.findByText('Successfully uploaded!')
    const progress = screen.getByTestId('progress-container')
    expect(progress).not.toHaveClass('error')
  })

  test('turns progress bar red when server reports row errors', async ()=>{
    vi.spyOn(api, 'uploadFile').mockResolvedValue({ inserted: 1, errors: [{ line: 2, message: 'invalid' }] } as any)
    render(<FileUpload />)

    const input = screen.getByTestId('file-input')
    const file = new File(['x,y'], 'bad.csv', { type: 'text/csv' })
    fireEvent.change(input, { target: { files: [file] } })

    await screen.findByText(/Error in uploading file, please try again./)
    const progress = screen.getByTestId('progress-container')
    expect(progress).toHaveClass('error')
  })

  test('stalls and turns progress bar red on network rejection', async ()=>{
    vi.spyOn(api, 'uploadFile').mockRejectedValue(new Error('network'))
    render(<FileUpload />)

    const input = screen.getByTestId('file-input')
    const file = new File(['x,y'], 'bad.csv', { type: 'text/csv' })
    fireEvent.change(input, { target: { files: [file] } })

    await screen.findByText(/Error in uploading file, please try again./)
    const progress = screen.getByTestId('progress-container')
    expect(progress).toHaveClass('error')
  })
})