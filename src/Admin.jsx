import React, {useState, useRef} from 'react'

export default function Admin({initial, onSave, onCancel}){
  const [jsonText, setJsonText] = useState(JSON.stringify(initial, null, 2))
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState(null)
  const fileRef = useRef(null)

  const showNotification = (text, type='success')=>{
    setNotification({text, type})
    setTimeout(()=> setNotification(null), 4000)
  }

  const handleSave = ()=>{
    try{
      const parsed = JSON.parse(jsonText)
      // Try to persist to backend if available. Use VITE_API_URL at build time if provided.
      (async ()=>{
        const API_BASE = import.meta.env.VITE_API_URL || ''
        const url = API_BASE ? `${API_BASE.replace(/\/$/, '')}/api/content` : '/api/content'
        try{
          const resp = await fetch(url, {
            method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(parsed)
          })
          if(resp.ok){
            onSave(parsed)
            setError(null)
            showNotification('Saved to server', 'success')
            return
          }
        }catch(e){ /* backend not reachable */ }
        // Fallback to local save
        onSave(parsed)
        setError(null)
        showNotification('Saved locally (server not available)', 'success')
      })()
    }catch(e){
      const msg = 'JSON parse error: ' + e.message
      setError(msg)
      showNotification(msg, 'error')
    }
  }

  const handleDownload = ()=>{
    const blob = new Blob([jsonText], {type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vv_content.json'
    a.click()
    URL.revokeObjectURL(url)
    showNotification('Downloaded JSON file', 'success')
  }

  const handleImportClick = ()=> fileRef.current && fileRef.current.click()

  const handleImport = (e)=>{
    const f = e.target.files && e.target.files[0]
    if(!f) return
    const reader = new FileReader()
    reader.onload = ()=>{
      try{
        const txt = reader.result
        const parsed = JSON.parse(txt) // validate
        setJsonText(JSON.stringify(parsed, null, 2))
        setPreview(parsed)
        showNotification('Imported JSON into editor', 'success')
      }catch(err){
        setError('Invalid JSON file: ' + err.message)
        showNotification('Invalid JSON file', 'error')
      }
    }
    reader.readAsText(f)
    // reset input so same file can be imported again
    e.target.value = ''
  }

  // preview state shows a small key/value summary of parsed JSON
  const [preview, setPreview] = useState(null)

  // update preview when editor changes and it's valid JSON
  const updatePreviewFromText = (text)=>{
    try{
      const p = JSON.parse(text)
      setPreview(p)
      setError(null)
    }catch(e){
      setPreview(null)
    }
  }

  // wire text changes to preview updates
  const onTextChange = (e)=>{
    const v = e.target.value
    setJsonText(v)
    updatePreviewFromText(v)
  }

  return (
    <div className="admin-overlay">
      <div className="admin-panel">
        <h3>Edit site content (JSON)</h3>
        <div className="editor-row">
          <textarea value={jsonText} onChange={onTextChange} spellCheck={false} />
          <div className="import-preview">
            <h4>Preview</h4>
            {preview ? (
              <pre>{JSON.stringify(preview, null, 2)}</pre>
            ) : (
              <div className="muted">No valid JSON to preview</div>
            )}
          </div>
        </div>
        {error && <div className="error">{error}</div>}

        <div className="admin-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleDownload}>Download JSON</button>
          <button onClick={handleImportClick}>Import JSON</button>
          <input ref={fileRef} type="file" accept="application/json" style={{display:'none'}} onChange={handleImport} />
          <button onClick={onCancel}>Cancel</button>
        </div>

        {notification && (
          <div className={`notification ${notification.type}`}>{notification.text}</div>
        )}

        <p className="hint">Tip: the changes are saved to localStorage so the site remains editable without a backend.</p>
      </div>
    </div>
  )
}
