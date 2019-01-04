const Koa = require('koa')
const fs = require('fs')
const path = require('path')

const app = new Koa()
app.use((ctx) => {
  const { path: reqPath } = ctx
  const filePath = path.join(__dirname, '..', 'demo', reqPath === '/' ? '/index.html' : reqPath)
  const exists = fs.existsSync(filePath)
  if (!exists) {
    ctx.status = 404
    return
  }

  let type = 'text'
  if (/html/.test(filePath)) {
    type = 'text/html'
  } else if (/css/.test(filePath)) {
    type = 'text/css'
  } else if (/js/.test(filePath)) {
    type = 'text/javascript'
  }
  ctx.type = type
  ctx.status = 200
  ctx.body = fs.createReadStream(filePath)
})

app.listen(3050)
console.log('Test Server listening on port 3050')
