import express from 'express'
import path from 'path'

const app = express()
const port = process.env.PORT || 3000
const dist = path.join(process.cwd(), 'dist')

// Serve built files
app.use(express.static(dist))

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(dist, 'index.html'))
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})