const fs = require('fs')
const { join } = require('path')

const fileNameRoot = 'ReactPlayer.standalone'
const fileName = `${fileNameRoot}.js`
const targetFileName = `${fileNameRoot}.es6.js`
const distPath = join(__dirname, '..', 'dist')
const fileReadPath = join(distPath, fileName)
const fileTargetPath = join(distPath, targetFileName)

fs.readFile(fileReadPath, 'utf8', (error, code) => {
  if (error) throw error
  const finalCode = `${code}\n\nexport default renderReactPlayer;\n`

  fs.writeFile(fileTargetPath, finalCode, (err) => {
    if (err) throw err
    console.log(`${targetFileName} has been created!`)
  })
})
