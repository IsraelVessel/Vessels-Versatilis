const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const DATA_FILE = path.join(__dirname, 'content.json')

function readData(){
  if(!fs.existsSync(DATA_FILE)) return null
  try{ return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) }catch(e){ return null }
}

app.get('/api/content', (req, res) => {
  const data = readData()
  if(!data) return res.status(404).json({ message: 'no content' })
  res.json(data)
})

app.post('/api/content', (req, res) => {
  try{
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2), 'utf8')
    return res.json({ ok: true })
  }catch(e){
    console.error('Failed to write content:', e)
    return res.status(500).json({ error: e.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`VV backend listening on ${PORT}`))
