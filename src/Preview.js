import React, { Component } from 'react'

const ICON_SIZE = '64px'

const cache = {}

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

  fetchImage ({ url, light, oEmbedUrl }) {
    if (React.isValidElement(light)) {
      return
    }
    if (typeof light === 'string') {
      this.setState({ image: light })
      return
    }
    if (cache[url]) {
      this.setState({ image: cache[url] })
      return
    }
    this.setState({ image: null })
    return window.fetch(oEmbedUrl.replace('{url}', url))
      .then(response => response.json())
      .then(data => {
        if (data.thumbnail_url && this.mounted) {
          const image = data.thumbnail_url.replace('height=100', 'height=480').replace('-d_295x166', '-d_640')
          this.setState({ image })
          cache[url] = image
        }
      })
  }

  handleKeyPress = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      this.props.onClick()
    }
  }

  render () {
    const { light, onClick, playIcon, previewTabIndex } = this.props
    const { image } = this.state
    const isElement = React.isValidElement(light)
    const flexCenter = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
    const styles = {
      preview: {
        width: '100%',
        height: '100%',
        backgroundImage: image && !isElement ? `url(${image})` : undefined,
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
        position: isElement ? 'absolute' : undefined,
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
      <div
        style={styles.preview}
        className='react-player__preview'
        onClick={onClick}
        tabIndex={previewTabIndex}
        onKeyPress={this.handleKeyPress}
      >
        {isElement ? light : null}
        {playIcon || defaultPlayIcon}
      </div>
    )
  }
}
