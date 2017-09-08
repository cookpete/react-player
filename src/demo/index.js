import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App'

const app = document.getElementById('app')

render(<AppContainer><App /></AppContainer>, app)

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    render(<AppContainer><NextApp /></AppContainer>, app)
  })
}
