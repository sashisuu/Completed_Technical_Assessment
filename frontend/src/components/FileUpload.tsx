import React, { useRef, useState } from 'react'
import { uploadFile } from '../api'

export default function FileUpload({ onSuccess }: { onSuccess?: () => void }){
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'success'|'error'|null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  async function uploadAndNotify(file: File){
    setProgress(0)
    setMessage(null)
    setMessageType(null)
    try{
      const res: any = await uploadFile(file, setProgress)
      
      if (res && Array.isArray(res.errors) && res.errors.length > 0) {
        // Content-level errors: request finished (100%), but data is bad
        setMessage(`Error in uploading file, please try again.`)
        setMessageType('error')
      } else {
        // Success
        setMessage(`Successfully uploaded!`)
        setMessageType('success')
      }
      setTimeout(() => setProgress(null), 1500) // Keep visible slightly longer for clarity
      onSuccess && onSuccess()
    } catch(e: any){
      // Network/Server failure: progress stops where it was
      setMessage(`Error in uploading file, please try again.`)
      setMessageType('error')
      // Note: We do NOT setProgress(null) immediately so the user sees the stalled red bar
      setTimeout(() => setProgress(null), 1500)
    } finally {
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function handleButtonClick(){
    fileRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0]
    if(!f){ return }
    setFileName(f.name)
    uploadAndNotify(f)
  }

  // Drag and Drop handlers remain unchanged
  function handleDragOver(e: React.DragEvent<HTMLDivElement>){
    e.preventDefault(); e.stopPropagation(); setIsDragging(true)
  }
  function handleDragLeave(e: React.DragEvent<HTMLDivElement>){
    e.preventDefault(); e.stopPropagation(); setIsDragging(false)
  }
  function handleDrop(e: React.DragEvent<HTMLDivElement>){
    e.preventDefault(); e.stopPropagation(); setIsDragging(false)
    const f = e.dataTransfer.files?.[0]
    if(!f) return
    setFileName(f.name)
    uploadAndNotify(f)
  }

  return (
    <div className="upload">
      <input data-testid="file-input" ref={fileRef} type="file" accept="text/csv" style={{display: 'none'}} onChange={handleFileChange} />

      <div
        className={`dropzone ${isDragging ? 'dragging' : ''}`}
        onClick={handleButtonClick}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleButtonClick() }}
      >
        <div className="dropText">Drag and drop file here, or</div>
        <div className="dropControls">
          <button onClick={(e) => { e.stopPropagation(); handleButtonClick() }}>
            {progress === null ? 'Upload CSV' : 'Uploading...'}
          </button>
          {fileName && <div className="filename">{fileName}</div>}
        </div>
      </div>

      {/* The progress bar now receives the "error" class if the upload fails */}
      {progress !== null && (
        <div data-testid="progress-container" className={`progress ${messageType === 'error' ? 'error' : ''}`}>
          <div style={{width: progress + '%'}}>{progress}%</div>
        </div>
      )}

      {message && <div data-testid="upload-message" className={`message ${messageType ?? ''}`}>{message}</div>}
    </div>
  )
}