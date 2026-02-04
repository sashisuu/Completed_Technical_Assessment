import React, { useState } from 'react'
import FileUpload from './components/FileUpload'
import DataList from './components/DataList'

export default function App() {
  const [reloadToken, setReloadToken] = useState(0);
  return (
    <div className="container">
      <h1>CSV Upload & Search</h1>
      <FileUpload onSuccess={() => setReloadToken((t) => t + 1)} />
      <DataList reload={reloadToken} />
    </div>
  )
}
