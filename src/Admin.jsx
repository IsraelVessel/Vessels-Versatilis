import React, {useState} from 'react'

export default function Admin({initial, onSave, onCancel}){
  const [jsonText, setJsonText] = useState(JSON.stringify(initial, null, 2))
  const [error, setError] = useState(null)

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
            return
          }
        }catch(e){ /* backend not reachable */ }
        // Fallback to local save
        onSave(parsed)
        setError(null)
      })()
    }catch(e){
      setError('JSON parse error: ' + e.message)
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
          <button onClick={onCancel}>Cancel</button>
        </div>
        <p className="hint">Tip: the changes are saved to localStorage so the site remains editable without a backend.</p>
      </div>
    </div>
  )
}
