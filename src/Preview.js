import React, { Component } from 'react'

const ICON_SIZE = '64px'

export default class Preview extends Component {
  state = {
    image: null
  }
  componentDidMount () {
    this.fetchImage(this.props)
  }
  componentWillReceiveProps (nextProps) {
    if (this.props.url !== nextProps.url) {
      this.fetchImage(nextProps)
    }
  }
  fetchImage ({ url, light }) {
    if (typeof light === 'string') {
      this.setState({ image: light })
      return
    }
    this.setState({ image: null })
    return window.fetch(`https://noembed.com/embed?url=${url}`)
      .then(response => response.json())
      .then(data => {
        if (data.thumbnail_url) {
          const image = data.thumbnail_url.replace('height=100', 'height=480')
          this.setState({ image })
        }
      })
  }
  render () {
    const { onClick } = this.props
    const { image } = this.state
    const flexCenter = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
    const styles = {
      preview: {
        width: '100%',
        height: '100%',
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        cursor: 'pointer',
        ...flexCenter
      },
      shadow: {
        background: 'radial-gradient(rgb(0, 0, 0, 0.3), rgba(0, 0, 0, 0) 60%)',
        borderRadius: ICON_SIZE,
        width: ICON_SIZE,
        height: ICON_SIZE,
        ...flexCenter
      },
      playIcon: {
        borderStyle: 'solid',
        borderWidth: '16px 0 16px 26px',
        borderColor: 'transparent transparent transparent white',
        marginLeft: '7px'
      }
    }
    return (
      <div style={styles.preview} className='react-player__preview' onClick={onClick}>
        <div style={styles.shadow} className='react-player__shadow'>
          <div style={styles.playIcon} className='react-player__play-icon' />
        </div>
      </div>
    )
  }
}
