import React from 'react'
import { render } from 'react-dom'
import ReactPlayer from './index.js'

export default function renderReactPlayer (container, props) {
  render(<ReactPlayer {...props} />, container)
}
