import React, { Component } from 'react'

const ICON_SIZE = '64px'

export default class Preview extends Component {
  mounted = false
  state = {
    image: null
  }

  componentDidMount () {
    this.mounted = true
    this.fetchImage(this.props)
  }

  componentDidUpdate (prevProps) {
    const { url, light } = this.props
    if (prevProps.url !== url || prevProps.light !== light) {
      this.fetchImage(this.props)
    }
  }

  componentWillUnmount () {
    this.mounted = false
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
        if (data.thumbnail_url && this.mounted) {
          const image = data.thumbnail_url.replace('height=100', 'height=480')
          this.setState({ image })
        }
      })
  }

  render () {
    const { onClick, playIcon } = this.props
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
    const defaultPlayIcon = (
      <div style={styles.shadow} className='react-player__shadow'>
        <div style={styles.playIcon} className='react-player__play-icon' />
      </div>
    )
    return (
      <div style={styles.preview} className='react-player__preview' onClick={onClick}>
        {playIcon || defaultPlayIcon}
      </div>
    )
  }
}
