import React from 'react'
import { render } from 'react-dom'
import ReactPlayer from './index'

export default function renderReactPlayer (container, props) {
  render(<ReactPlayer {...props} />, container)
}
