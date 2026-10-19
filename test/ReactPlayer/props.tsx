import '../helpers/server-safe-globals.js';
import { test } from 'zora';
import React from 'react';
import { create } from 'react-test-renderer';
import ReactPlayer from '../../src/index';
import { render } from '../helpers/helpers';

test('className', async (t) => {
  const wrapper = render(<ReactPlayer className="react-player" />);
  t.equal(wrapper.root.findByType('video').props.className, 'react-player');
});

test('style', (t) => {
  const wrapper = render(<ReactPlayer style={{ marginTop: '1rem' }} />);
  t.equal(wrapper.root.findByType('video').props.style.marginTop, '1rem');
});

test('wrapper - string', (t) => {
  const wrapper = create(<ReactPlayer wrapper="span" />);
  t.equal(wrapper.toJSON().type, 'span');
});

test('wrapper - element', (t) => {
  const Element = () => null;
  const wrapper = create(<ReactPlayer wrapper={Element} />);
  t.ok(wrapper.root.findByType(Element));
});

test('renders controlsList and disablePictureInPicture on the media element', (t) => {
  const wrapper = render(
    <ReactPlayer
      src="video.mp4"
      controls
      controlsList="nodownload noplaybackrate"
      disablePictureInPicture
    />
  );
  const media = wrapper.root.findByType('video');
  t.equal(media.props.controlsList, 'nodownload noplaybackrate');
  t.equal(media.props.disablePictureInPicture, true);
  t.equal(media.props.config, undefined);
});

test('applies config.html.attributes without putting config on the media element', (t) => {
  const wrapper = render(
    <ReactPlayer
      src="video.mp4"
      controls
      config={{
        youtube: { color: 'white' },
        html: {
          attributes: {
            controlsList: 'nodownload',
            disablePictureInPicture: true,
          },
        },
      }}
    />
  );
  const media = wrapper.root.findByType('video');
  t.equal(media.props.controlsList, 'nodownload');
  t.equal(media.props.disablePictureInPicture, true);
  t.equal(media.props.config, undefined);
});

test('an explicit false overrides config.html.attributes', (t) => {
  const wrapper = render(
    <ReactPlayer
      src="video.mp4"
      disablePictureInPicture={false}
      config={{
        html: {
          attributes: {
            disablePictureInPicture: true,
          },
        },
      }}
    />
  );
  t.equal(wrapper.root.findByType('video').props.disablePictureInPicture, false);
});

test('player props override config.html.attributes', (t) => {
  const wrapper = render(
    <ReactPlayer
      src="video.mp4"
      controlsList="nofullscreen"
      config={{
        html: {
          attributes: {
            controlsList: 'nodownload',
          },
        },
      }}
    />
  );
  t.equal(wrapper.root.findByType('video').props.controlsList, 'nofullscreen');
});

test('applies config.html.attributes to audio sources', (t) => {
  const wrapper = render(
    <ReactPlayer
      src="song.mp3"
      config={{
        html: {
          attributes: {
            controlsList: 'nodownload',
          },
        },
      }}
    />
  );
  const media = wrapper.root.findByType('audio');
  t.equal(media.props.controlsList, 'nodownload');
  t.equal(media.props.config, undefined);
});
