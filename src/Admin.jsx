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
      // Try to persist to backend if available
      (async ()=>{
        try{
          const resp = await fetch('/api/content', {
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
        JSON.parse(txt) // validate
        setJsonText(txt)
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

  return (
    <div className="admin-overlay">
      <div className="admin-panel">
        <h3>Edit site content (JSON)</h3>
        <textarea value={jsonText} onChange={e=>setJsonText(e.target.value)} spellCheck={false} />
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
