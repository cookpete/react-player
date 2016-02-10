import React from 'react'

export default function Duration ({ className, seconds }) {
  return (
    <time dateTime={`P${Math.round(seconds)}S`} className={className}>
      {format(seconds)}
    </time>
  )
}

function format (seconds) {
  const date = new Date(seconds * 1000)
  const hh = date.getHours()
  const mm = date.getMinutes()
  const ss = pad(date.getSeconds())
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`
  }
  return `${mm}:${ss}`
}

function pad (string) {
  return ('0' + string).slice(-2)
}
