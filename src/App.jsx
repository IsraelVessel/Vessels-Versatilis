import React, {useEffect, useState} from 'react'
import Admin from './Admin'

const DEFAULT = {
  companyName: 'Vessels Versatilis',
  structure: 'Sole Proprietorship',
  mainProduct: 'Conglomerate',
  category: 'large Business',
  employment: 'large Enterprise',
  address: 'N0 14 Off Oguniyi Avenue Ado Ekiti',
  industry: 'Specialised Services',
  area: 'Contracting',
  description: 'Vessels Versatilis a large parent corporation that owns or controls several independent companies, or subsidiaries, operating in completely unrelated industries.',
  premise: 'Location Ekiti state'
}

function App(){
  const [content, setContent] = useState(DEFAULT)
  const [editing, setEditing] = useState(false)

  useEffect(()=>{
    async function load(){
      // Try backend first
      try{
        const resp = await fetch('/api/content')
        if(resp.ok){
          const data = await resp.json()
          setContent(data)
          try{ localStorage.setItem('vv_content', JSON.stringify(data)) }catch(e){}
          return
        }
      }catch(e){ /* backend not available, fallback to localStorage */ }

      try{
        const saved = localStorage.getItem('vv_content')
        if(saved){ setContent(JSON.parse(saved)) }
      }catch(e){ console.warn('Failed to parse saved content', e) }
    }

    load()
  }, [])

  const openAdmin = ()=> setEditing(true)
  const onSave = (newContent)=>{
    setContent(newContent)
    localStorage.setItem('vv_content', JSON.stringify(newContent))
    setEditing(false)
  }

  return (
    <div className="site-root">
      <header className="hero">
        <div className="hero-inner">
          <h1>{content.companyName}</h1>
          <p className="tag">{content.industry} · {content.area}</p>
          <p className="desc">{content.description}</p>
          <div className="meta">
            <div><strong>Structure:</strong> {content.structure}</div>
            <div><strong>Category:</strong> {content.category}</div>
            <div><strong>Employment:</strong> {content.employment}</div>
          </div>
          <div className="cta-row">
            <button onClick={openAdmin}>Edit content</button>
            <a className="contact" href={`https://maps.google.com/?q=${encodeURIComponent(content.address)}`} target="_blank" rel="noreferrer">Open address</a>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="card">
          <h2>Business Details</h2>
          <dl>
            <dt>Main product</dt><dd>{content.mainProduct}</dd>
            <dt>Specific area</dt><dd>{content.area}</dd>
            <dt>Address</dt><dd>{content.address}</dd>
            <dt>Business premise</dt><dd>{content.premise}</dd>
          </dl>
        </section>

        <section className="card">
          <h2>About the Company</h2>
          <p>{content.description}</p>
        </section>
      </main>

      <footer className="site-footer">
        <small>© {new Date().getFullYear()} {content.companyName} · {content.address}</small>
      </footer>

      {editing && <Admin initial={content} onSave={onSave} onCancel={()=>setEditing(false)} />}
    </div>
  )
}

export default App
