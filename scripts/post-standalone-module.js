const fs = require('fs')
const { join } = require('path')

const fileNameRoot = 'ReactPlayer.standalone'
const fileName = `${fileNameRoot}.js`
const targetFileName = `${fileNameRoot}-module.js`
const PATH_DIST = join(__dirname, '..', 'dist')
const fileReadPath = join(PATH_DIST, fileName)
const fileTargetPath = join(PATH_DIST, targetFileName)

/**
 * Simple function to generate a ES6 module export from
 * standalone.js file.
 */
const writeFile = () => {
  fs.readFile(fileReadPath, 'utf8', (error, code) => {
    if (error) throw error
    const finalCode = `${code}\n\nexport default renderReactPlayer;\n`

    fs.writeFile(fileTargetPath, finalCode, (err) => {
      if (err) throw err
      console.log(`${targetFileName} has been created!`)
    })
  })
}
writeFile()
